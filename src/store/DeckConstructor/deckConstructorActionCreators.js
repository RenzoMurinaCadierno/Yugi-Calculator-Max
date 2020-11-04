import * as deckConstructorActionTypes from "./deckConstructorActionTypes"

// cardObject: <object> an object with { name: <string>, type: <string>, quantity: <number> }
// isAddingCardFromList: <boolean> true means we are adding a card from the database-
// fetched card list. On false, we are increasing the card's quantity by its in-deck
// <MiniCircle />
export const addCard = (cardObject, isAddingCardFromList) => ({
  type: deckConstructorActionTypes.ADD_CARD,
  payload: { cardObject, isAddingCardFromList }
})

// cardName: <string>
export const removeCard = (cardName) => ({
  type: deckConstructorActionTypes.REMOVE_CARD,
  payload: cardName
})

// newSection: <string> "main", "side", "extra" or "test"
export const changeSection = (newSection) => ({
  type: deckConstructorActionTypes.CHANGE_SECTION,
  payload: newSection
})

// cardName: <string>
// targetSection: <string> either "main", "side" or "extra"
export const moveCardBetweenSections = (cardName, targetSection) => ({
  type: deckConstructorActionTypes.MOVE_CARD_BETWEEN_SECTIONS,
  payload: { cardName, targetSection }
})

export const sortSection = () => ({
  type: deckConstructorActionTypes.SORT_SECTION
})

// deckId: <number> deck number after "deck_" string in state. "deck_5" is 5
export const switchDeck = (deckId) => ({
  type: deckConstructorActionTypes.SWITCH_DECK,
  payload: deckId
})

// deckKey: <string> deck key in local storage. "deck_1", "deck_2" and the likes
export const deleteDeck = (deckKey) => ({
  type: deckConstructorActionTypes.DELETE_DECK,
  payload: deckKey
})

export const addDeck = () => ({
  type: deckConstructorActionTypes.ADD_DECK
})

// newDeckName: <string>
export const setDeckName = (newDeckName) => ({
  type: deckConstructorActionTypes.SET_DECK_NAME,
  payload: newDeckName
})

// newSaveState: <boolean> true means changes were made and deck can be saved
export const setCanSave = (newSaveState) => ({
  type: deckConstructorActionTypes.SET_CAN_SAVE,
  payload: newSaveState
})

export const initializeFallbackDeck = () => ({
  type: deckConstructorActionTypes.INITIALIZE_FALLBACK_DECK
})

// isShufflingDeck: <boolean> true means state.fallbackTestDeck is filled and
// needs to be shuffled and set to state.deck_<id>.test. False is the other way
// round. The "test" section needs to be cleared and state.fallbackTestDeck, resetted
export const intitializeTestDeck = (isShufflingDeck) => ({
  type: deckConstructorActionTypes.INITIALIZE_TEST_DECK,
  payload: isShufflingDeck
})

export const clearTestDeck = () => ({
  type: deckConstructorActionTypes.CLEAR_TEST_DECK
})

// quantity: <number> the amount of cards to remove from state.fallbackTestDeck
// and add to state.deck_<id>.test
export const drawTestCard = (quantity) => ({
  type: deckConstructorActionTypes.DRAW_TEST_CARD,
  payload: quantity
})
