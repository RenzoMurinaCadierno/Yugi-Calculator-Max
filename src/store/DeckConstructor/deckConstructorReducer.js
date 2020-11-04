import * as deckConstructorActionTypes from "./deckConstructorActionTypes"
import { getSlicedArray, shuffleArray } from "../../utils/utilityFunctions"
import { YugiohValidator } from "../../utils/validators"
import {
  getSimpleCardTypeObj,
  getCardQuantityInDeck,
  getCardDefaultSection,
  getCardIndexInSection,
  getStartingDeckSkeleton,
  generateCardTypeMap,
  sortSectionAndCleanMap
} from "../../utils/yugiohSpecificFunctions"

const fallbackDeck = getStartingDeckSkeleton()

const fallbackState = {
  selectedDeckSection: "main",
  selectedDeckId: 1,
  sectionWasModified: false,
  canSave: false,
  fallbackDeck: { ...fallbackDeck },
  fallbackTestDeck: []
}

const initialState = {
  // keep decks separated to avoid updating a massive array with all decks
  // each time the state of one deck section changes
  deck_1: { main: [], side: [], extra: [], test: [], name: "" },
  deck_2: { main: [], side: [], extra: [], test: [], name: "" },
  deck_3: { main: [], side: [], extra: [], test: [], name: "" },
  ...fallbackState
}

let deckKey = ""
let currentDeck = { main: [], side: [], extra: [], test: [], name: "" }
let currentSection = ""
let cardIndexInSection = 0
let targetCard = {}
let cardTypeMap = generateCardTypeMap()
let sectionArrGenerator
const ygoVal = new YugiohValidator()

export default function deckConstructorReducer(state = initialState, action) {
  // reducer was extremely bloated, so I moved the logic below to make each case
  // visibly leaner. You can also see here which cases need the action to work
  switch (action.type) {
    case deckConstructorActionTypes.ADD_CARD:
      return addCardLogic(state, action)

    case deckConstructorActionTypes.CHANGE_SECTION:
      return changeSectionLogic(state, action)

    case deckConstructorActionTypes.REMOVE_CARD:
      return removeCardLogic(state, action)

    case deckConstructorActionTypes.MOVE_CARD_BETWEEN_SECTIONS:
      return moveCardBetweenSectionsLogic(state, action)

    case deckConstructorActionTypes.SORT_SECTION:
      return sortSectionLogic(state)

    case deckConstructorActionTypes.SWITCH_DECK:
      return switchDeckLogic(state, action)

    case deckConstructorActionTypes.DELETE_DECK:
      return deleteDeckLogic(state, action)

    case deckConstructorActionTypes.ADD_DECK:
      return addDeckLogic(state)

    case deckConstructorActionTypes.SET_DECK_NAME:
      return setDeckLogic(state, action)

    case deckConstructorActionTypes.SET_CAN_SAVE:
      return setCanSaveLogic(state, action)

    case deckConstructorActionTypes.INITIALIZE_FALLBACK_DECK:
      return initializeFallbackDeckLogic(state)

    case deckConstructorActionTypes.CLEAR_TEST_DECK:
      return clearTestDeckLogic(state)

    case deckConstructorActionTypes.INITIALIZE_TEST_DECK:
      return initializeTestDeckLogic(state, action)

    case deckConstructorActionTypes.DRAW_TEST_CARD:
      return drawTestCardLogic(state, action)

    default:
      return state
  }
}

function setCurrentDeckKeyAndValue(state, deckId) {
  // setter function for deckKey and currentDeck global variables
  deckKey = `deck_${deckId ?? state.selectedDeckId}`
  currentDeck = state[deckKey]
}

function getNewSectionArray(
  sectionArr, // <array> an array with all card objects in the target section
  cardIndexInSection, // <number> the index of the target card object in the section
  cardObj, // <object> target card object we are adding/removing/modifying
  cardQuantityInDeck, // <number> sum of all of that cardObj quantity value in the whole deck
  sectionIsAtMaxLimit // <bool> if no more cards can be added in the section (max limit archieved)
) {
  // not passing a card object implies we are removing a card from list. Slice it at index
  if (!cardObj) {
    return getSlicedArray(currentDeck[currentSection], cardIndexInSection)
  }
  // if we got a card object and it exists in the section, then increase its amount by 1
  // Given the case there are 3 copies of that card in the whole deck, then decrease its
  // quantity to 1 in the target section (loop back to 1 copy in the section)
  return cardIndexInSection > -1
    ? getSlicedArray(sectionArr, cardIndexInSection, {
        ...cardObj,
        quantity:
          cardQuantityInDeck < 3 && !sectionIsAtMaxLimit
            ? sectionArr[cardIndexInSection].quantity + 1
            : 1
      })
    : // no index of cardObject in the section signifies there is no such card. Add it
      [...sectionArr, { ...cardObj, quantity: 1 }]
}

function getOriginAndTargetSectionNewArrays(
  cardObj, // <object> target card object we are adding/removing/modifying
  originSection, // <string> the section name the card will move from
  targetSection, // <string> the section name the card will move to
  cardIndexInOriginSection, // <number> the index of the card object in origin section
  cardIndexInTargetSection // <number> the index of the card object in destination section
) {
  return {
    // while moving a card object from origin section, if its quantity is higher than
    // 1, then reduce it by 1. Otherwise, remove the object completely
    [originSection]:
      cardObj.quantity > 1
        ? getSlicedArray(currentDeck[originSection], cardIndexInOriginSection, {
            ...cardObj,
            quantity: cardObj.quantity - 1
          })
        : getSlicedArray(currentDeck[originSection], cardIndexInOriginSection),
    // upon recieving a card object, if target destination section already has one with
    // the same name, increase its quantity by 1. Otherwise, add it to the array.
    [targetSection]:
      cardIndexInTargetSection > -1
        ? getSlicedArray(currentDeck[targetSection], cardIndexInTargetSection, {
            ...currentDeck[targetSection][cardIndexInTargetSection],
            quantity:
              currentDeck[targetSection][cardIndexInTargetSection].quantity + 1
          })
        : [...currentDeck[targetSection], { ...cardObj, quantity: 1 }]
  }
}

export function getLastDeckId(state) {
  let lastDeckId = 0
  // take each "deck_<id>" key in state, reckon the highest id, and return it + 1
  Object.keys(state).forEach((key) => {
    if (key.slice(0, 5) === "deck_" && +key[5] > lastDeckId) {
      lastDeckId = +key[5]
    }
  })
  return ++lastDeckId
}

function addCardLogic(state, action) {
  // do nothing if we are in "Test" section. We cannot add cards from there
  if (ygoVal.isSection(state.selectedDeckSection, "test")) return state
  // reduce the detailed card object coming from database to just its "name", "type" and "qty"
  targetCard = getSimpleCardTypeObj(action.payload.cardObject)
  // get the default section a card should be added to (e.g. spells to "main", fusions to "extra")
  const cardDefaultSection = getCardDefaultSection(targetCard.type)
  // if we are sitting in a section a card is compatible with (it can be placed there),
  // set currentSection to that section. Otherwise, use the card default section
  currentSection =
    !ygoVal.isSection(state.selectedDeckSection, cardDefaultSection) &&
    !ygoVal.isSection(state.selectedDeckSection, "side")
      ? cardDefaultSection
      : state.selectedDeckSection
  // sync deckKey and currentDeck to current values
  setCurrentDeckKeyAndValue(state)
  // boolean telling us if max card limit for that section was reached (cannot add more cards)
  const sectionIsAtMaxLimit = ygoVal.isMaxLimitInSectionExceeded(
    currentSection,
    currentDeck[currentSection]
  )
  // store the card quantity of all cards that match card-to-add's name across all sections
  const cardQuantityInDeck = getCardQuantityInDeck(
    targetCard.name,
    currentDeck[getCardDefaultSection(targetCard.type)],
    currentDeck.side
  )
  // do nothing if are we attempting to add a card from <CardList /> filter and either
  // no more cards can be added to the section or there are already 3 copies of that card
  if (
    action.payload.isAddingCardFromList &&
    (cardQuantityInDeck > 2 || sectionIsAtMaxLimit)
  ) {
    return state
  }
  // the target card can be added to the deck. Find its index in current section.
  cardIndexInSection = getCardIndexInSection(
    currentDeck[currentSection],
    targetCard.name
  )
  // modify current deck's current section's array with the new card object to add if
  // it was not there before, or with its quantity + 1 if it was already there
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      [currentSection]: getNewSectionArray(
        currentDeck[currentSection],
        cardIndexInSection,
        targetCard,
        cardQuantityInDeck,
        sectionIsAtMaxLimit
      )
    },
    sectionWasModified: true, // flag to re-sort cards in section
    canSave: true // flag to activate save state
  }
}

function changeSectionLogic(state, action) {
  // clicking on the same section title is a null action by default.
  // But as a safeguard, block it in reducer too.
  if (action.payload === state.selectedDeckSection) return state
  // we are switching to a new section, update state with it
  return {
    ...state,
    selectedDeckSection: action.payload
  }
}

function removeCardLogic(state, action) {
  // sync deckKey, currentDeck and currentSection to values at this time
  setCurrentDeckKeyAndValue(state)
  currentSection = state.selectedDeckSection
  // find the index of the card to remove inside currentSection's array
  cardIndexInSection = getCardIndexInSection(
    currentDeck[currentSection],
    action.payload
  )
  // remove the card from the section if index was found. Otherwise, do not touch
  // the section array.
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      [currentSection]: getNewSectionArray(
        currentDeck[currentSection],
        cardIndexInSection
      )
    },
    sectionWasModified: true, // flag to re-sort cards in section
    canSave: true // flag to activate save state
  }
}

function moveCardBetweenSectionsLogic(state, action) {
  // sync deckKey, currentDeck and currentSection to values at this time
  setCurrentDeckKeyAndValue(state)
  currentSection = state.selectedDeckSection
  // destructure action.payload to dry code
  const { targetSection, cardName } = action.payload
  // find the index of the card to move between sections inside current section's array
  cardIndexInSection = getCardIndexInSection(
    currentDeck[currentSection],
    cardName
  )
  // target it with the out-of-state variable. Dries code and saves it upon removal
  targetCard = currentDeck[currentSection][cardIndexInSection]
  // if the section where the card needs to land after moving it is already at max limit,
  // or the card quantity of the card in current section + the card quantity of the card
  // in target section > maximum quantity of cards with same name (normally 3), do nothing
  if (
    ygoVal.isMaxLimitInSectionExceeded(
      targetSection,
      currentDeck[targetSection]
    ) ||
    ygoVal.isCardLimitInSectionExceeded(targetCard, currentDeck[targetSection])
  ) {
    return state
  }
  // find the index of the card to move between sections inside the array of the section
  // it will be moved to
  const cardIndexInTargetSection = getCardIndexInSection(
    currentDeck[targetSection],
    cardName
  )
  // construct new arrays for both the array where the card was moved from and the array
  // where the card was moved to
  const newArrays = getOriginAndTargetSectionNewArrays(
    targetCard,
    currentSection,
    targetSection,
    cardIndexInSection,
    cardIndexInTargetSection
  )
  // set both new arrays to the current section and the section where the card was moved to
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      [currentSection]: newArrays[currentSection],
      [targetSection]: newArrays[targetSection]
    },
    sectionWasModified: true, // flag to re-sort cards in section
    canSave: true // flag to activate save state
  }
}

function sortSectionLogic(state) {
  // "main", "side" and "extra" deck sections are the only ones capable of sorting
  if (state.selectedDeckSection === "test") return state
  // sync deckKey and currentDeck to values at this time
  setCurrentDeckKeyAndValue(state)
  // cosntruct a generator for cardTypeMap given all card objects in current section
  sectionArrGenerator = sortSectionAndCleanMap(
    currentDeck[state.selectedDeckSection],
    cardTypeMap
  )
  // store the newly sorted array coming from first yield
  const sortedSection = sectionArrGenerator.next().value
  // clean up and reconstruct cardTypeMap with the second yield
  cardTypeMap = sectionArrGenerator.next().value
  // set the new sorted array to the deck section we are currently in
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      [state.selectedDeckSection]: sortedSection
    },
    sectionWasModified: false // flag as NOT to re-sort the section. We did it here
  }
}

function switchDeckLogic(state, action) {
  // if the current selected deck can be saved and we switch to a different deck,
  // we assign the former stored deck its fallback state (that is, with no changes).
  // On the contrary, if the deck was saved before switching to a new one, we just
  // keep it as it is in state at the time of switching to a new one.
  // Default all relevant state values needed for a fresh new deck load.
  return {
    ...state,
    [`deck_${state.selectedDeckId}`]: state.canSave
      ? { ...state.fallbackDeck }
      : state[`deck_${state.selectedDeckId}`],
    fallbackDeck: state[`deck_${action.payload}`],
    selectedDeckId: action.payload,
    selectedDeckSection: "main",
    sectionWasModified: false,
    canSave: false
  }
}

function deleteDeckLogic(state, action) {
  // counter to reassign all ids in ascending order
  let i = 0
  // map all keys in state
  let arrayStateObj = Object.entries(state).reduce((acc, keyValPair) => {
    // grab their beginning 5 characters ("deck_", "fallb", "selec" and the likes)
    const deckString = keyValPair[0].slice(0, 5)
    // if they match the key of the deck to be deleted or anything that is not a deck
    // key, ignore it
    if (keyValPair[0] === action.payload || deckString !== "deck_") {
      return acc
    }
    // each remaining deck key is appended a counter in ascending fashion, beginning
    // with 1. "deck_1", "deck_2", and so on. Keep in mind the deleted deck is no longer
    // present, and the deck key that came after it now holds its key.
    return { ...acc, [deckString + ++i]: keyValPair[1] }
  }, {})
  // given the case there are no decks left (we deleted the only deck remaning), then
  // "deck_1" will not be present in state. So, manually add it as default.
  // This assures there will always be one deck both in state and in Local Storage
  if (!arrayStateObj.deck_1) {
    arrayStateObj = { ...arrayStateObj, deck_1: { ...fallbackDeck } }
  }
  // Now, if we deleted a deck that was not the one loaded and was not the first one
  // in list, keep the selected one loaded on screen. Otherwise, default the selection
  // to the previous deck in list.
  const deletedDeckId = +action.payload[5] // deck's id (deck_<id>)
  let newSelectedDeckId = 0
  if (state.selectedDeckId >= deletedDeckId && state.selectedDeckId !== 1) {
    newSelectedDeckId = state.selectedDeckId - 1
  } else if (state.selectedDeckId < deletedDeckId) {
    newSelectedDeckId = state.selectedDeckId
  } else {
    newSelectedDeckId = 1
  }
  // finally, use all data to recreate state
  return {
    ...arrayStateObj,
    ...fallbackState,
    selectedDeckId: newSelectedDeckId
  }
}

function addDeckLogic(state) {
  // grab the id of the last deck in state (number after "deck_")
  const lastDeckId = getLastDeckId(state)
  // if there were unsaved changes in the loaded deck at the moment of adding, assign
  // the former stored deck its fallback state (that is, with no changes). Otherwise,
  // keep the deck as is in state.
  // Create a new "deck_<id>" key in state with "name" being "Deck <lastDeckId>". Set
  // all of its other values as default. Sync selectedDeckId to its id and selectedDeckSection
  // to "main" (always default on load). Flag of no changes to be saved.
  return {
    ...state,
    [`deck_${state.selectedDeckId}`]: state.canSave
      ? { ...state.fallbackDeck }
      : state[`deck_${state.selectedDeckId}`],
    [`deck_${lastDeckId}`]: { ...fallbackDeck, name: `Deck ${lastDeckId}` },
    selectedDeckId: lastDeckId,
    selectedDeckSection: "main",
    canSave: false
  }
}

function setDeckLogic(state, action) {
  // sync deckKey and currentDeck to values at this time
  setCurrentDeckKeyAndValue(state)
  // simply modify loaded deck's name to the one assigned and flag save state
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      name: action.payload
    },
    canSave: true
  }
}

function setCanSaveLogic(state, action) {
  // on an already truthy save state (canSave)
  if (state.canSave) {
    // and a truthy payload, do nothing
    if (action.payload) return state
    // falsy payload means we are indeed saving the deck. Update fallbackDeck
    else
      return {
        ...state,
        canSave: action.payload,
        fallbackDeck: state[`deck_${state.selectedDeckId}`]
      }
  }
  // any other case, if canSave is falsy, set it to true
  return {
    ...state,
    canSave: action.payload
  }
}

function initializeFallbackDeckLogic(state) {
  // sync fallbackDeck to the currently loaded deck
  return {
    ...state,
    fallbackDeck: state[`deck_${state.selectedDeckId}`]
  }
}

function clearTestDeckLogic(state) {
  // if "test" section in currently loaded deck contains at least one card,
  // clear that section by setting an empty array to it.
  if (state[`deck_${state.selectedDeckId}`].test.length) {
    return {
      ...state,
      [state[`deck_${state.selectedDeckId}`]]: {
        ...state[`deck_${state.selectedDeckId}`],
        test: []
      }
    }
  }
  // if it is already clean, do nothing
  return state
}

function initializeTestDeckLogic(state, action) {
  // sync deckKey and currentDeck to values at this time
  setCurrentDeckKeyAndValue(state)
  // now, understand that "Test" section is different from the others in a way that
  // card objects with the same name are not grouped into one with its quantity ===
  // to the amount of cards that share that name, but it holds all individual card
  // objects with quantity === 1. This is so as to be able to handle "shuffle" and
  // "draw" actions in a way where cards are displayed properly, one by one.
  let curCard = []
  // "test" section is designed to, indeed, test hands of cards in "main" section.
  // So, reduce it into a single array of card objects all with quantity === 1,
  // in the same fashion explained above
  const currentTestDeck = currentDeck.main.reduce((deck, cardObj) => {
    curCard = []
    for (let i = 0; i < cardObj.quantity; i++)
      curCard.push({
        ...cardObj,
        reactKey: cardObj.name + Math.random(), // before we used the name as key, now we need a unique one
        quantity: 1
      })
    return [...deck, ...curCard]
  }, [])
  // once constructed, shuffle the array
  shuffleArray(currentTestDeck)
  // action.payload is a boolean. True means we are shuffling the deck (passing cards)
  // from fallbackTestDeck to "test" section. False is the other way round: we are
  // cleaning "test" section to re-test cards. Thus, depending on that boolean we clear
  // or populate either "test" section or fallbackTestDeck
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      test: action.payload ? currentTestDeck : []
    },
    fallbackTestDeck: action.payload ? [] : currentTestDeck
  }
}

function drawTestCardLogic(state, action) {
  // sync deckKey and currentDeck to values at this time
  setCurrentDeckKeyAndValue(state)
  // copy the current "test" section in a new array and push the amount of drawn
  // cards (action.payload) from the beginning of fallbackTestDeck to it
  const newTestDeck = [...currentDeck.test]
  newTestDeck.push(state.fallbackTestDeck.slice(0, +action.payload))
  // since we are pushing an array into another array, set "test" section as that
  // array, flattened. And since we used cards from fallbackTestDeck, slice them out
  return {
    ...state,
    [deckKey]: {
      ...currentDeck,
      test: newTestDeck.flat()
    },
    fallbackTestDeck: state.fallbackTestDeck.slice(+action.payload)
  }
}
