import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  memo
} from "react"
import PropTypes from "prop-types"
import { DeckBuilderContext } from "../../../contexts/DeckBuilderContext"
import { CardSearchContext } from "../../../contexts/CardSearchContext"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import * as deckConstructorActionCreators from "../../../store/DeckConstructor/deckConstructorActionCreators"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import Toast from "../../UI/Toast/Toast"
import SecondaryScreen from "../../UI/SecondaryScreen/SecondaryScreen"
import SaveDeleteOrAddDeck from "../SaveDeleteOrAddDeck/SaveDeleteOrAddDeck"
import DeckMenu from "../DeckMenu/DeckMenu"
import HelpSection from "../HelpSection/HelpSection"
import { getLastDeckId } from "../../../store/DeckConstructor/deckConstructorReducer"
import {
  sortLocalStorageAfterDeletingDeck,
  getSlicedString
} from "../../../utils/utilityFunctions"
import {
  getStartingDeckSkeleton,
  getDeckLimitToastMessage
} from "../../../utils/yugiohSpecificFunctions"
import { getCardObject } from "../../../utils/apiFunctions"
import { YugiohValidator } from "../../../utils/validators"
import uiConfigs from "../../../utils/ui.configs.json"
import {
  classes,
  handleActionBeforeDeleting,
  getAdditionalToastJSX
} from "./SecondaryScreens.utils"
import styles from "./SecondaryScreens.module.css"

const defaultDeck = getStartingDeckSkeleton()

function SecondaryScreens({
  toggleSecondScreen, // <function> UIContext's SecondaryScreen global toggler
  secondScreenState, // <boolean> UIContext's SecondaryScreen global state
  secondScreenType, // <string> UIContext's SecondaryScreen global type
  setScreenIsFrozen, // <function> UIContext's swipe freezing toggler
  toastState, // <boolean> UIContext's Toast component global state
  dispatchToastAction, // <function> UIContext's Toast reducer action dispatcher
  modalSFX, // <object> useAudioControl object for on/off modal sound effects
  playSFXs, // <boolean> global on/off switch for audios
  switchSFX, // <object> useAudioControl object for "switch" and "success" sound effects
  clickOKSFX, // <object> useAudioControl object for "confirm" and "OK" sound effects
  swipe // <function> App.js screen swiping function
}) {
  const {
    deckState,
    dispatchDeckAction,
    deleteAndGetLSObject,
    updateLSandGetLSasJSObj
  } = useContext(DeckBuilderContext)
  // card search reducer action dispatch will trigger on "i" (card info) option
  const { dispatchSearchAction } = useContext(CardSearchContext)
  // state manager for deck operations ("saving", "deleting", "adding")
  const [currentOperation, setCurrentOperation] = useState(null)
  // Deck Selector's clicked deck id tracker (!== from deckState.selectedDeckId)
  const [clickedDeckId, setClickedDeckId] = useState(0)
  // boolean to track if Toast should close on a given action
  const [closeToastFlag, setCloseToastFlag] = useState(false)
  // save al togglers into a variable to try drying code
  const toastTogglers = uiConfigs.togglers.toast
  // if deckState holds a key named "deck_<maxPossibleDecks>", it means deck limit
  // was reached (no more decks can be created). We block "Add deck" component with this
  const isDeckLimitReached = deckState.hasOwnProperty(
    `deck_${uiConfigs.deckBuilderConfigs.maxDecksAmount}`
  )

  const unfreezeApp = useCallback(() => {
    // unfreeze swiping and clear current operation
    setScreenIsFrozen(false)
    setCurrentOperation(null)
  }, [setScreenIsFrozen, setCurrentOperation])

  const setToast = useCallback(
    // function to dry code (avoid this same line as it is used lots)
    (text, url, type) => {
      dispatchToastAction(toastActionCreators.setToastState(text, url, type))
    },
    [dispatchToastAction]
  )

  const handleCloseToast = useCallback(() => {
    // close action dispatch to assign to Toast's "X" close icon
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  const handleSwitchDeck = useCallback(
    (deckId) => {
      // switch deck using reducer action, trigger confirmation sound effect and
      // close both toast and secondary screen
      dispatchDeckAction(deckConstructorActionCreators.switchDeck(deckId))
      switchSFX.play()
      toggleSecondScreen()
      handleCloseToast()
    },
    [toggleSecondScreen, handleCloseToast]
  )

  const handleDeleteDeck = useCallback(() => {
    // delete the deck from Local Storage
    deleteAndGetLSObject({
      key: uiConfigs.localStorageDecksObjectKeys.decks,
      nestedKey: toastState.url, // url will store deck key to be deleted in Local Storage
      removeKey: true, // the key should be completely destroyed
      callbackBeforeUpdating: (modifiedLSObj) =>
        sortLocalStorageAfterDeletingDeck(modifiedLSObj) // sort all "deck_" keys after deleting one
    })
    // delete the deck from reducer too, to sync view with Local Storage
    dispatchDeckAction(deckConstructorActionCreators.deleteDeck(toastState.url))
    // play a confirmation sound effect and close secondary screens
    clickOKSFX.play()
    toggleSecondScreen()
    setCloseToastFlag(false)
    // set url to null to clear deck Local Storage key in Toast reducer and use
    // saveDeck toggler for shorter inactive timeout
    setToast("Deck deleted!", null, toastTogglers.saveDeck)
  }, [deleteAndGetLSObject, sortLocalStorageAfterDeletingDeck, toastState.url])

  const handleDeckChange = useCallback(
    (operation) => {
      // trigger the whole process only if currentOperation is null (meaning we are not
      // dealing with any operation already). We freeze the app to give LS the chance
      // to update and to prevent the user (or bot) from clicking rapidly.
      if (!currentOperation) {
        setScreenIsFrozen(true)
        setCurrentOperation(operation)
      }
    },
    [setScreenIsFrozen, setCurrentOperation, currentOperation]
  )

  const handleAddDeck = useCallback(() => {
    let lastDeckId = 0
    // trigger the reducer to add the new deck
    dispatchDeckAction(deckConstructorActionCreators.addDeck())
    // do the same with Local Storage. Notice we need the previous Local Storage
    // object to calculate the new one before updating. It comes to us in the
    // function assigned as arg, and we return the new value to update in it.
    updateLSandGetLSasJSObj({
      key: uiConfigs.localStorageDecksObjectKeys.decks,
      genValueWithLS: (LSObj) => {
        lastDeckId = getLastDeckId(LSObj.decks) // grab the last deck # in keys + 1
        return {
          // create a new key using that number, and set an empty deck as value
          [`deck_${lastDeckId}`]: {
            ...defaultDeck,
            name: `Deck ${lastDeckId}`
          }
        }
      }
    })
    // play a confirmation sound effect
    clickOKSFX.play()
    // screen is frozen for 250ms to give time to LocalStorage to update.
    // Afterwards, the app unfreezes and notifies the user with a Toast
    const localStorageHandicapTimer = setTimeout(() => {
      setToast(
        `Added and loaded "Deck ${lastDeckId}"!`,
        null,
        toastTogglers.saveDeck
      )
      unfreezeApp()
      clearTimeout(localStorageHandicapTimer)
    }, 250)
  }, [deckState.canSave, clickOKSFX])

  const handleCardSearch = useCallback(() => {
    // clicking on "i" (info) MiniCircles anywhere in <DeckBuilder />'s page will
    // trigger a Toast asking the user to confirm if they want to fetch info. This
    // is the handler for that confirmation, so dispatch a CardSearch's reducer action
    // to render the respective card on <CardSearch /> page, after constructing a
    // proper Card object for its view.
    dispatchSearchAction(
      cardSearchActionCreators.setCurrentCard(getCardObject(toastState.url))
    )
    // once done, automatically swipe right, which will unmount <DeckBuilder /> and
    // mount <CardSearch />
    swipe("right")
    // close the confirmation toast afterwards
    handleCloseToast()
  }, [getCardObject, toastState.url, swipe])

  useEffect(() => {
    // flag is used here to preventively close Toast upon closing secondary screen
    // if the confirmation message before deleting a deck is still showing
    if (!secondScreenState && closeToastFlag) {
      setCloseToastFlag(false) // reset the flag
      handleCloseToast() // force close the Toast
    }
  }, [secondScreenState])

  useEffect(() => {
    let localStorageHandicapTimer
    // if useEffect was triggered by handleDeckChange(), which freezes screen:
    if (currentOperation) {
      // check if we only have the default deck (base name and 0 cards) in the reducer
      const isDefaultDeck = new YugiohValidator().isStartingDeck(
        deckState.deck_1,
        defaultDeck
      )
      // case 1: we are saving the deck
      if (currentOperation === "saving") {
        // on an attempt to save an empty deck: warn the user, unfreeze app and end operation
        if (isDefaultDeck && !deckState.deck_2) {
          setToast("Cannot save a default deck!", null, toastTogglers.saveDeck)
          unfreezeApp()
          // on a valid deck to save (sections are not empty and/or name !== from default)
        } else {
          // update only the current deck in Local Storage
          updateLSandGetLSasJSObj({
            key: uiConfigs.localStorageDecksObjectKeys.decks,
            nestedKey: `deck_${deckState.selectedDeckId}`,
            value: deckState[`deck_${deckState.selectedDeckId}`]
          })
          // freeze screen for 250ms to give time to LocalStorage to update.
          // Afterwards, unfreeze everything and notify the user with a Toast and a sfx
          localStorageHandicapTimer = setTimeout(() => {
            clickOKSFX.play()
            setToast("Deck saved!", null, toastTogglers.saveDeck)
            unfreezeApp()
          }, 250)
        }
        // register save tracking boolean in reducer to false
        dispatchDeckAction(deckConstructorActionCreators.setCanSave(false))
        // case 2: we are deleting a deck
      } else if (currentOperation === "deleting") {
        handleActionBeforeDeleting(
          // tried to dry the code here. Function is down below
          getSlicedString,
          setClickedDeckId,
          setCloseToastFlag,
          setToast,
          unfreezeApp,
          clickedDeckId,
          deckState,
          isDefaultDeck,
          toastTogglers
        )
        // case 3: we are adding a new deck
      } else if (currentOperation === "adding") {
        // if deck quantity is exceeded, warn the user and end the operation
        if (deckState[`deck_${uiConfigs.deckBuilderConfigs.maxDecksAmount}`]) {
          setToast(getDeckLimitToastMessage(), null, toastTogglers.deleteDeck)
          unfreezeApp()
          // otherwise, if current deck has unsaved changes, ask for confirmation
          // before proceeding. All unsaved data will be lost if so.
        } else if (deckState.canSave) {
          setToast(
            "Unsaved changes in current deck!",
            null,
            toastTogglers.addDeck
          )
          // give time for local storage to update before unfreezing
          localStorageHandicapTimer = setTimeout(() => {
            unfreezeApp()
          }, 250)
          // if deck limit was not reached and there are unsaved changes, simply
          // trigger handleAddDeck() to create and load a new empty one
        } else {
          handleAddDeck()
        }
        // all cases close the secondary screen
        toggleSecondScreen()
      }
    }
    return () => {
      // on cleanup, unfreeze the app and clear timeout -if any-
      localStorageHandicapTimer && clearTimeout(localStorageHandicapTimer)
      setScreenIsFrozen(false)
    }
  }, [currentOperation, clickedDeckId])

  return (
    <>
      <Toast
        show={toastState.isActive}
        toggler={handleCloseToast}
        inactiveTimeout={
          uiConfigs.timeouts.toast[
            `inactive${
              toastState.type === "saveDeck" ? "SaveDeck" : "DeleteDeck"
            }`
          ]
        }
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
        classNames={classes.toast}
      >
        <div className={styles.ToastText}>{toastState.text}</div>
        {
          // "deleteDeck", "addDeck" and "cardInfo" Toast togglers all hold aditional
          // JSX to display in Toast. They have their own styles (clickable), and logic
          // is kept separated as a mere attempt at drying code
          getAdditionalToastJSX(
            toastState,
            toastState.type === "deleteDeck"
              ? handleDeleteDeck
              : toastState.type === "addDeck"
              ? handleAddDeck
              : handleCardSearch
          )
        }
      </Toast>
      {secondScreenState && (
        <SecondaryScreen
          toggle={toggleSecondScreen}
          flex
          scrollable={
            // only "Help" secondary screen is scrollable
            secondScreenType ===
            uiConfigs.togglers.secondaryScreens.deckCreatorHelp
          }
          animation="translateDown"
          sfxObj={modalSFX}
        >
          {
            // selectOrEditDeck toggler renders Deck Selector and editing components
            secondScreenType ===
              uiConfigs.togglers.secondaryScreens.selectOrEditDeck && (
              <div className={styles.GridDisplay}>
                <DeckMenu
                  deckState={deckState}
                  clickedDeckId={clickedDeckId}
                  setClickedDeckId={setClickedDeckId}
                  dispatchToastAction={dispatchToastAction}
                  onSwitchDeck={handleSwitchDeck}
                  classNames={classes.deckSelectComponent}
                />
                <SaveDeleteOrAddDeck
                  isSaveDeckComponent
                  currentOperation={currentOperation}
                  canSave={deckState.canSave}
                  handleDeckChange={handleDeckChange}
                  classNames={classes.saveDeckComponent}
                />
                <SaveDeleteOrAddDeck
                  isDeleteDeckComponent
                  currentOperation={currentOperation}
                  clickedDeckId={clickedDeckId}
                  handleDeckChange={handleDeckChange}
                  classNames={classes.deleteDeckComponent}
                />
                <SaveDeleteOrAddDeck
                  isAddDeckComponent
                  currentOperation={currentOperation}
                  clickedDeckId={clickedDeckId}
                  handleDeckChange={handleDeckChange}
                  deckLimitwasReached={isDeckLimitReached}
                  classNames={classes.addDeckComponent}
                />
              </div>
            )
          }
          {
            // deckCreatorHelp toggler renders <HelpSection /> component
            secondScreenType ===
              uiConfigs.togglers.secondaryScreens.deckCreatorHelp && (
              <HelpSection playSFXs={playSFXs} />
            )
          }
        </SecondaryScreen>
      )}
    </>
  )
}

SecondaryScreens.propTypes = {
  toggleSecondScreen: PropTypes.func.isRequired,
  secondScreenState: PropTypes.bool.isRequired,
  secondScreenType: PropTypes.string.isRequired,
  toastState: PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
    isActive: PropTypes.bool,
    refreshTimeoutToggler: PropTypes.bool
  }).isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  setScreenIsFrozen: PropTypes.func.isRequired,
  modalSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  switchSFX: PropTypes.object.isRequired,
  clickOKSFX: PropTypes.object.isRequired,
  swipe: PropTypes.func.isRequired
}

export default memo(SecondaryScreens)
