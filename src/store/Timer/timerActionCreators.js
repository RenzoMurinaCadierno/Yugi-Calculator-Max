import * as timerActionTypes from "./timerActionTypes"

export const toggleTimerFrozen = () => ({
  type: timerActionTypes.TOGGLE_TIMER_FROZEN
})

export const toggleTimerRunning = () => ({
  type: timerActionTypes.TOGGLE_TIMER_RUNNING
})

// timerObject: <object> {hs: <string>, mins: <string>, secs: <string>}
export const startTimer = (timerObject) => ({
  type: timerActionTypes.START_TIMER,
  payload: timerObject
})

export const stopTimer = () => ({
  type: timerActionTypes.STOP_TIMER
})

// timerObject: <object> {hs: <string>, mins: <string>, secs: <string>}
export const setTime = (timerObject) => ({
  type: timerActionTypes.SET_TIME,
  payload: timerObject
})

// hsOrMinsOrSecsObject: <object> {hs: 10} or {mins: 30} for example
export const changeTimerInput = (hsOrMinsOrSecsObject) => ({
  type: timerActionTypes.CHANGE_TIMER_INPUT,
  payload: hsOrMinsOrSecsObject
})
