import * as logActionTypes from "./logActionTypes"

// logObjectWithTypeTextTimerKeys: <object>
// { type: <string>, text: <string>, timer: <string>, logPing: <boolean> }
export const log = (logObjectWithTypeTextTimerKeys) => ({
  type: logActionTypes.LOG,
  payload: logObjectWithTypeTextTimerKeys
})

export const toggle = () => ({
  type: logActionTypes.TOGGLE
})
