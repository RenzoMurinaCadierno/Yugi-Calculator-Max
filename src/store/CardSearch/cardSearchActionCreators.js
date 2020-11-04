import * as cardSearchActionTypes from "./cardSearchActionTypes"

// currentCard: <object> a valid cardObject {img, prices, data} to be displayed in view
export const setCurrentCard = (currentCardObject) => ({
  type: cardSearchActionTypes.SET_CURRENT_CARD,
  payload: currentCardObject
})

// currentList: <Array> an array of filtered database card objects
export const setCurrentList = (currentList) => ({
  type: cardSearchActionTypes.SET_CURRENT_LIST,
  payload: currentList
})

// searchTerm: <string> "search" input's value
export const filterList = (searchTerm) => ({
  type: cardSearchActionTypes.FILTER_LIST,
  payload: searchTerm
})

// altImgId: <string> the id of the target card image to fetch in database
export const setAltImgId = (altImgId) => ({
  type: cardSearchActionTypes.SET_ALT_IMG_ID,
  payload: altImgId
})

export const displayListScreen = () => ({
  type: cardSearchActionTypes.DISPLAY_LIST_SCREEN
})

export const displayCardScreen = () => ({
  type: cardSearchActionTypes.DISPLAY_CARD_SCREEN
})

export const setLoading = () => ({
  type: cardSearchActionTypes.SET_LOADING
})

// errorMsg: <string> the error message to set when card loading fails
export const setError = (errorMsg) => ({
  type: cardSearchActionTypes.SET_ERROR,
  payload: errorMsg
})

export const resetFetchState = () => ({
  type: cardSearchActionTypes.RESET_FETCH_STATE
})
