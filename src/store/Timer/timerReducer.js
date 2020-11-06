import { validateInputOnChange } from "../../utils/utilityFunctions"
import * as actionTypes from "./timerActionTypes"
import uiConfigs from "../../utils/ui.configs.json"

const initialState = {
  timerObject: {
    hs: uiConfigs.initialTimer.hs,
    mins: uiConfigs.initialTimer.mins,
    secs: uiConfigs.initialTimer.secs
  },
  previousInitialTime: {
    hs: uiConfigs.initialTimer.hs,
    mins: uiConfigs.initialTimer.mins,
    secs: uiConfigs.initialTimer.secs
  },
  isTimerFrozen: false,
  isTimerRunning: false
}

export default function timerReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_TIMER_FROZEN:
      // isTimerFrozen determines if the timer is Paused (stopped or not)
      return {
        ...state,
        isTimerFrozen: !state.isTimerFrozen
      }

    case actionTypes.TOGGLE_TIMER_RUNNING:
      // isTimerRunning specifies that the timer has started, even if it is
      // currently paused.
      // If it is not running, we start it up using the previous configured
      // time as its starting point.
      if (state.isTimerRunning)
        return {
          ...state,
          timerObject: {
            ...state.previousInitialTime
          },
          isTimerRunning: !state.isTimerRunning
        }
      // if it was running, it means we paused it. Just flip isTimerRunning around
      return {
        ...state,
        isTimerRunning: !state.isTimerRunning
      }

    case actionTypes.START_TIMER:
      // on a valid timer configuration, sync both timerObject (which will tick)
      // and previousInitialTime which will serve to reset the timer back to its
      // original value. After that, unfreeze the timer and make it run.
      return {
        ...state,
        timerObject: {
          ...state.timerObject,
          ...action.payload
        },
        previousInitialTime: {
          ...state.previousInitialTime,
          ...action.payload
        },
        isTimerFrozen: false,
        isTimerRunning: true
      }

    case actionTypes.STOP_TIMER:
      // dead stop the timer.
      return {
        ...state,
        isTimerFrozen: true,
        isTimerRunning: false
      }

    case actionTypes.SET_TIME:
      // just set timerObject with the configs coming from payload.
      return {
        ...state,
        timerObject: action.payload
      }

    case actionTypes.CHANGE_TIMER_INPUT:
      // this action is called upon each individual timer input manual change by the user.
      // First, get the name ("hs", "mins" or "secs") and the value from payload
      let { name, value } = action.payload
      // if they hold an invalid value, do nothing
      if (!validateInputOnChange(value, 2)) return state
      // "mins" and "secs" cannot go beyond 59, and "hours", beyond 23
      if ((name === "mins" || name === "secs") && Number.parseInt(value) > 59) {
        value = 59
      } else if (name === "hs" && Number.parseInt(value) > 23) {
        value = 23
      }
      // update the corresponding key in timerObject with its new value.
      return {
        ...state,
        timerObject: {
          ...state.timerObject,
          [name]: value
        }
      }

    default:
      return state
  }
}
