import * as actionTypes from "./cardSearchActionTypes"

const initialState = {
  currentCard: {
    img: "",
    prices: {},
    data: {}
  },
  currentList: [],
  filterableList: [],
  altImgId: "",
  isInListScreen: true,
  isLoading: false,
  hasError: false,
  errorMsg: ""
}

export default function cardSearchReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CARD:
      // set currentCard state object to the constructed object valid to
      // display in view. Also set isInListScreen to false, which will toggle
      // view to <DescPriceScreen />
      return {
        ...state,
        currentCard: {
          img: action.payload.img,
          prices: action.payload.prices,
          data: action.payload.data
        },
        isInListScreen: false
      }
    case actionTypes.SET_CURRENT_LIST:
      // set both currentList (immutable full database-fetched results) and filterableList
      // (same, but mutable depeding on <input> filtering) to what comes from the
      // database. Also set isInListScreen to true, which will toggles view to
      // <ListScreen />
      return {
        ...state,
        currentList: action.payload,
        filterableList: action.payload,
        isInListScreen: true
      }
    case actionTypes.FILTER_LIST:
      // set filterableList to the result of currentList filtered by "search"
      // <input>'s current value
      return {
        ...state,
        filterableList: state.currentList.filter((cardName) =>
          cardName.name.toLowerCase().includes(action.payload.toLowerCase())
        )
      }
    case actionTypes.SET_ALT_IMG_ID:
      // set altImgId to a valid card string id to search in database
      return {
        ...state,
        altImgId: action.payload
      }
    case actionTypes.DISPLAY_LIST_SCREEN:
      // set isInListScreen to true, which will toggles view to  <ListScreen />
      return {
        ...state,
        isInListScreen: true
      }
    case actionTypes.DISPLAY_CARD_SCREEN:
      // set isInListScreen to false, which will toggle view to <DescPriceScreen />
      return {
        ...state,
        isInListScreen: false
      }
    case actionTypes.SET_LOADING:
      // set fetch state to loading and clear error states
      return {
        ...state,
        isLoading: true,
        hasError: false,
        errorMsg: ""
      }
    case actionTypes.SET_ERROR:
      // set fetch state to error with the given message, and loading to false
      return {
        ...state,
        isLoading: false,
        hasError: true,
        errorMsg: action.payload
      }
    case actionTypes.RESET_FETCH_STATE:
      // clear fetch state (loading and error to default)
      return {
        ...state,
        isLoading: false,
        hasError: false,
        errorMsg: ""
      }
    default:
      return state
  }
}
