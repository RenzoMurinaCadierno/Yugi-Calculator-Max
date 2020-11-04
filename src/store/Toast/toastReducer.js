import * as toastActionTypes from "./toastActionTypes"

const initialState = {
  text: "",
  url: "",
  type: "",
  logTypeArray: [],
  isActive: false,
  refreshTimeoutToggler: false
}

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case toastActionTypes.SET_TOAST_STATE:
      // generic action to manually set anything in state according to payload.
      // Triggering this will activate the <Toast /> and will refresh its timeout
      // (will toggle refreshTimeoutToggler, which serves as a listener to refresh
      // <Toast /> active status' timer)
      return {
        ...state,
        text: action.payload.text,
        url: action.payload.url,
        type: action.payload.type,
        isActive: true,
        refreshTimeoutToggler: !state.refreshTimeoutToggler
      }

    case toastActionTypes.SET_LOG_TYPE:
      // This action triggers when toggling any "log" switch ("lp", "timer", "dice",
      // "coin")
      // First, find the index of the type passed as payload inside logTypeArray
      const { logType } = action.payload
      const logIndex = state.logTypeArray.findIndex((log) => log === logType)
      // if index is -1, logType is not in the array, so update the array concatenating
      // that logType to it. Config the rest of <Toast /> state and set isActive to
      // true, which toggles it on
      if (logIndex < 0) {
        return {
          ...state,
          text: "Currently logging:",
          logTypeArray: [...state.logTypeArray, logType],
          isActive: true,
          type: "logSwitches",
          refreshTimeoutToggler: !state.refreshTimeoutToggler
        }
        // if index exists, then that logType is already in the array. Form a new
        // logTypeArray splicing that logType, and do the same as above with the
        // rest of <Toast />'s state.
        // Keep in mind that if there is only one element in the array before
        // splicing, we have to set text to indicate the user there is nothing
        // being logged currently.
      } else if (logIndex >= 0) {
        return {
          ...state,
          text:
            state.logTypeArray.length <= 1
              ? "All logs are turned off."
              : "Currently logging:",
          logTypeArray: [
            ...state.logTypeArray.slice(0, logIndex),
            ...state.logTypeArray.slice(logIndex + 1)
          ],
          isActive: true,
          type: "logSwitches",
          refreshTimeoutToggler: !state.refreshTimeoutToggler
        }
      }
      return state

    case toastActionTypes.CLOSE_TOAST: {
      // set isActive to false, which toggles the <Toast /> off.
      return {
        ...state,
        isActive: false
      }
    }

    case toastActionTypes.OPEN_TOAST: {
      // set isActive to true, which toggles the <Toast /> on.
      return {
        ...state,
        isActive: true
      }
    }

    default:
      return state
  }
}
