import * as logActionTypes from "./logActionTypes"
import * as lpActionTypes from "../LifePoints/lifePointsActionTypes"

const initialState = {
  logState: false,
  logType: "",
  logText: "",
  logIgTimer: "",
  logPing: false
}

export default function logReducer(state = initialState, action) {
  switch (action.type) {
    case logActionTypes.LOG:
      // logState determines if the current action needs to be logged
      // (the settings has been turned on). So, if false, do nothing.
      if (!state.logState) return state
      // otherwise, update state with the payload. Since "LP" log has several
      // actions, we centralize them all in "lp" category.
      const { type, text, timer, logPing } = action.payload
      return {
        ...state,
        logType: Object.keys(lpActionTypes).includes(type) ? "lp" : type,
        logText: text,
        logIgTimer: timer,
        logPing
      }

    case logActionTypes.TOGGLE:
      // logState determines if an action has to be logged or not
      return {
        ...state,
        logState: !state.logState,
        logType: "",
        logText: "",
        logIgTimer: ""
      }

    default:
      return state
  }
}
