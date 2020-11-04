import React, {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
  useCallback
} from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import useFetch from "../hooks/useFetch"
import { UIContext } from "./UIContext"
import deckConstructorReducer from "../store/DeckConstructor/deckConstructorReducer"
import * as deckConstructorActionCreators from "../store/DeckConstructor/deckConstructorActionCreators"
import * as toastActionCreators from "../store/Toast/toastActionCreators"
import { getStartingDeckSkeleton } from "../utils/yugiohSpecificFunctions"
import uiConfigs from "../utils/ui.configs.json"

const defaultDeck = getStartingDeckSkeleton()
const defaultLocalStorageStartingDeck = { deck_1: defaultDeck }
let initialDecksInLocalStorage = {}

export const DeckBuilderContext = createContext({
  cardListState: {},
  cardCache: [],
  deckState: {},
  dispatchDeckAction: () => {},
  updateLSandGetLSasJSObj: () => {},
  deleteAndGetLSObject: () => {},
  cardFetchLastDate: {},
  setFetchCardsNewDate: () => {},
  fetchCardList: () => {},
  setCardCache: () => {},
  triggerCardDetailsToast: () => {}
})

export function DeckBuilderContextProvider({ children }) {
  const { dispatchToastAction } = useContext(UIContext)
  // state to hold and set date objects as strings, which will be measured against
  // current date to determine if we can refetch cards from database
  const [cardFetchLastDate, setCardFetchLastDate] = useState("")
  // cache to store the cards retrieved from database. It will be immutable unless
  // cards are re-fetched. "cards" array down the component line will be modified
  // by filtering this cache
  const [cardCache, setCardCache] = useState([])
  // card database fetch state and fetch function configged with database url
  const [cardListState, fetchCardList] = useFetch(
    uiConfigs.apiConfigs.globalCardListURL
  )
  // "decks" localstorage handler functions
  const {
    getLSasJSObject,
    updateLSandGetLSasJSObj,
    deleteAndGetLSObject
  } = useLocalStorage(
    uiConfigs.localStorageDecksKeyName,
    uiConfigs.initialDecksLocalStorage
  )
  // "configs" localstorage handler functions
  const configsLS = useLocalStorage(
    uiConfigs.localStorageConfigsKeyName,
    uiConfigs.initialConfigsLocalStorage
  )
  // reducer state and action dispatcher for this component tree.
  // Initial state needs to be calculated with local storage. Function is down below
  const [deckState, dispatchDeckAction] = useReducer(
    deckConstructorReducer,
    getInitialLocalStorage(getLSasJSObject, updateLSandGetLSasJSObj)
  )

  const setFetchCardsNewDate = useCallback(() => {
    // grab a new date object, update "configs" local storage object with it
    // and sync state with that same date
    const currentDateObj = new Date()
    configsLS.updateLSandGetLSasJSObj({
      key: uiConfigs.localStorageConfigsObjectKeys.fetchedCardsLastDate,
      value: [currentDateObj], // as an array to be compatible with all other LS values
      overrideValue: true
    })
    setCardFetchLastDate(currentDateObj)
  }, [configsLS.updateLSandGetLSasJSObj, setCardFetchLastDate])

  const triggerCardDetailsToast = useCallback(
    // we need to determine which message to show in toast depending on cardCache.
    // Instead of using context hook deep inside nested components, we generate a
    // callback'd function here to be passed down
    (cardObj) => {
      // find the respective card object in cache (list of card objects with all details)
      const detailedCardObj = cardCache.find(
        (card) => card.name === cardObj.name
      )
      // if found, it means we have a compatible object to render <CardSearch /> view.
      // Notify it with a toast and give the user the chance to show it in UI.
      if (detailedCardObj) {
        dispatchToastAction(
          toastActionCreators.setToastState(
            "Click to show details for",
            detailedCardObj,
            "cardInfo"
          )
        )
        // otherwise, cache does not hold a detailed card object compatible with the card's
        // name (cards weren't fetched from DB or there was an error). Notify the user too.
      } else {
        dispatchToastAction(
          toastActionCreators.setToastState(
            'Cannot display card info. Try reloading the app or resetting cards at "Configs" page.',
            null,
            "cardInfoWarning"
          )
        )
      }
    },
    [dispatchToastAction, cardCache]
  )

  useEffect(() => {
    // on mount, parse "configs" local storage and retrieve the last date when
    // cards were manually retrieved from database (user fetch)
    const { fetchedCardsLastDate } = configsLS.getLSasJSObject()
    // if fetchedCardsLastDate key has length, it means is not null nor an empty
    // string. So sync state with its value
    if (fetchedCardsLastDate.length) {
      setCardFetchLastDate(fetchedCardsLastDate[0])
    }
    // also on mount, make sure to update to the current value of initialDecksInLocalStorage,
    // which is always sync'd with localStorage decks or the default one if none
    updateLSandGetLSasJSObj({
      key: uiConfigs.localStorageDecksObjectKeys.decks,
      value: initialDecksInLocalStorage
    })
    // and sync fallbackDeck in reducer with the active deck
    dispatchDeckAction(deckConstructorActionCreators.initializeFallbackDeck())
  }, [dispatchDeckAction, setCardFetchLastDate, configsLS.getLSasJSObject])

  useEffect(() => {
    // whenever cards are re-fetched, update card cache. This is the only instance
    // where card cache should change
    cardListState.data && setCardCache(cardListState.data)
  }, [cardListState.data])

  // unite all values to be provided by this context into an object
  const passedContext = {
    cardListState,
    cardCache,
    deckState,
    dispatchDeckAction,
    updateLSandGetLSasJSObj,
    deleteAndGetLSObject,
    cardFetchLastDate,
    setFetchCardsNewDate,
    fetchCardList,
    setCardCache,
    triggerCardDetailsToast
  }

  return (
    <DeckBuilderContext.Provider value={passedContext}>
      {children}
    </DeckBuilderContext.Provider>
  )
}

function getInitialLocalStorage(localStorageGetter) {
  // get "decks" local storage values (all "deck_<id>" objects)
  const { decks } = localStorageGetter()
  // if there were at least one, assign them to initialDecksInLocalStorage,
  // otherwise create a new default deck object and assign it.
  // We keep it in a separate outer variable as we will need to contrast it
  // if local storage keys are deleted at running time (on an app reset)
  initialDecksInLocalStorage = Object.keys(decks).length
    ? decks
    : defaultLocalStorageStartingDeck
  // construct a valid reducer state to initialize it
  return {
    ...initialDecksInLocalStorage,
    selectedDeckId: 1,
    selectedDeckSection: "main",
    sectionWasModified: false,
    canSave: false,
    fallbackDeck: defaultDeck,
    fallbackTestDeck: []
  }
}
