import * as pageSwipeActionTypes from "./pageSwipeActionTypes"

const initialState = {
  pageArray: [],
  slide: "left-slide"
}

export default function pageSwipeReducer(state = initialState, action) {
  // we will re-arrange the page sites array on all cases, so keep it always declared
  let pageArrayCopy = []

  switch (action.type) {
    case pageSwipeActionTypes.GO_FORWARD:
      // shift the page in the front and place it in the back, which
      // leads to having the former second page in the array as the
      // first one, and the former first as the now last
      pageArrayCopy = [...state.pageArray]
      const currentPage = pageArrayCopy.shift()
      pageArrayCopy.push(currentPage)
      return {
        ...state,
        pageArray: pageArrayCopy,
        slide: "right-slide"
      }

    case pageSwipeActionTypes.GO_BACK:
      // following the same logic as above, to go back we pop the last
      // page in the array to unshift it at the front
      pageArrayCopy = [...state.pageArray]
      const lastPage = pageArrayCopy.pop()
      pageArrayCopy.unshift(lastPage)
      return {
        ...state,
        pageArray: pageArrayCopy,
        slide: "left-slide"
      }

    case pageSwipeActionTypes.SYNC_STARTING_URL_WITH_PAGE_ARRAY:
      // here is a tricky one. If we mount the app on any page but "/calc" (default
      // first page), then the page array will be desync'd, as it always starts
      // in the same order ("calc" is the default first element in the array).
      // To circumvent this, we get history.location.pathname as payload (current
      // loaded page), and then loop over each front page of the array to try match
      // their names with the payload. On each loop, if there is no match we place
      // the front page in the array at the back and repeat the process. Once the
      // first element of the array matches the payload, the current pathname will
      // be synced with page array. Thus, order restored.
      pageArrayCopy = [...state.pageArray]
      const pageToSyncToFront = action.payload.slice(1)
      let frontPage = pageArrayCopy[0]
      let pageToPushBack
      while (frontPage !== pageToSyncToFront) {
        pageToPushBack = pageArrayCopy.shift()
        pageArrayCopy.push(pageToPushBack)
        frontPage = pageArrayCopy[0]
      }
      return {
        ...state,
        pageArray: pageArrayCopy
      }

    default:
      return state
  }
}
