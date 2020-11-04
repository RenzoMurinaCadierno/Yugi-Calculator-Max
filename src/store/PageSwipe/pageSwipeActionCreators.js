import * as pageSwipeActionTypes from "./pageSwipeActionTypes"

export const goBack = () => ({
  type: pageSwipeActionTypes.GO_BACK
})

export const goForward = () => ({
  type: pageSwipeActionTypes.GO_FORWARD
})

// historyLocationPathname: <string> window.history.location.pathname
export const syncStartingURLwithPageArray = (historyLocationPathname) => ({
  type: pageSwipeActionTypes.SYNC_STARTING_URL_WITH_PAGE_ARRAY,
  payload: historyLocationPathname
})
