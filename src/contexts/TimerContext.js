import React, { createContext, useReducer, useEffect } from "react"
import timerReducer from "../store/Timer/timerReducer"
import useLogReducer from "../hooks/useLogReducer"
import uiConfigs from "../utils/ui.configs.json"
import { tick } from "../utils/utilityFunctions"
import * as timerActionCreators from "../store/Timer/timerActionCreators"

export const TimerContext = createContext({
  timerObject: {},
  previousInitialTime: {},
  isTimerFrozen: false,
  isTimerRunning: false,
  dispatchTimerAction: () => {},
  log: {},
  logDispatch: () => {}
})

export function TimerContextProvider({ children }) {
  // initialize a timer reducer here. Its state needs to persist across components
  // as not only it is needed by several of them, but also if timer is ticking
  // we have to make sure unmounting components does not kill the action
  const [timerState, dispatchTimerAction] = useReducer(timerReducer, {
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
  })
  // spread timer reducer state's variables
  const {
    timerObject,
    previousInitialTime,
    isTimerRunning,
    isTimerFrozen
  } = timerState
  // create a log reducer and dispatcher to be applied to timer actions logging
  const [log, logDispatch] = useLogReducer(
    uiConfigs.localStorageLogsObjectKeys.logHistory,
    null,
    {
      logState: false,
      logType: "",
      logText: "",
      logIgTimer: ""
    }
  )

  useEffect(() => {
    // useEffect to perform timer ticks
    const timer = setTimeout(() => {
      // if timer is not running, timer is paused or we hit 00:00:00,
      // clear timeout
      if (
        isTimerFrozen ||
        !isTimerRunning ||
        (timerObject.hs === "00" &&
          timerObject.mins === "00" &&
          timerObject.secs === "00")
      ) {
        return clearTimeout(timer)
      }
      // otherwise, dispatch a timer action to tick one second
      dispatchTimerAction(timerActionCreators.setTime(tick(timerObject)))
    }, 1000)
    // on cleanup, clear timeout
    return () => clearTimeout(timer)
  }, [timerObject, isTimerFrozen, isTimerRunning])

  // unite all values to be provided by this context into an object
  const passedContext = {
    timerObject,
    previousInitialTime,
    isTimerFrozen,
    isTimerRunning,
    dispatchTimerAction,
    log,
    logDispatch
  }

  return (
    <TimerContext.Provider value={passedContext}>
      {children}
    </TimerContext.Provider>
  )
}
