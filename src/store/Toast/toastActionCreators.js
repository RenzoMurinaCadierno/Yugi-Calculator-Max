import * as toastActionTypes from "./toastActionTypes"

// text: <string> <Toast />'s text to -normally- show in its body
// url: <string|React.node> an extra property with mutiple purposes: it can
// hold a url to render a clickable link, an additional string to complement
// "text" or a whole React Node to be rendered in <Toast />
// type: <string> <Toast /> type string, which will trigger the proper toast
// logTypeArray: <Array> a logTypeArray to manually override the reducer's
export const setToastState = (text, url, type, logTypeArray) => ({
  type: toastActionTypes.SET_TOAST_STATE,
  payload: { text, url, type, logTypeArray }
})

// logTypeString: <string> "dice", "lp", "timer", "coin". Used to filter
// logTypeArray in reducer
export const setLogType = (logTypeString) => ({
  type: toastActionTypes.SET_LOG_TYPE,
  payload: { logType: logTypeString }
})

export const closeToast = () => ({
  type: toastActionTypes.CLOSE_TOAST
})

export const openToast = () => ({
  type: toastActionTypes.OPEN_TOAST
})
