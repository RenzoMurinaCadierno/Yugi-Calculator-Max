import React, { createContext, useReducer, useCallback } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import logPageReducer from "../store/LogPage/logPageReducer"
import * as logPageActionCreators from "../store/LogPage/logPageActionCreators"
import uiConfigs from "../utils/ui.configs.json"

export const LogContext = createContext({
  logPageState: {},
  dispatchLogPageAction: () => {},
  updateLSandGetLSasJSObj: () => {},
  mountLogs: () => {},
  filterLogs: () => {},
  deleteLSLogHistory: () => {}
})

export function LogContextProvider({ children }) {
  // initialize a local storage handler hook for "Logs". It will manage
  // an array with all log objects across components and app reloads
  const {
    getLSasJSObject,
    updateLSandGetLSasJSObj,
    deleteAndGetLSObject
  } = useLocalStorage(
    uiConfigs.localStorageLogsKeyName,
    uiConfigs.initialLogsLocalStorage,
    { maxLogLength: uiConfigs.maxLogLength }
  )
  // create a logPage reducer to manage adding/removing/displaying log objects
  // in <LogPage />'s components
  const [logPageState, dispatchLogPageAction] = useReducer(logPageReducer, {
    logs: [],
    cache: [],
    activeIcon: "all"
  })

  const mountLogs = useCallback(() => {
    // This function is triggered at <LogPage />'s mount, to load all logs from
    // local storage. It bring all logs from LocalStorage, reverses them (last
    // ones shown first), and sets both array states with it
    const logHistory = getLSasJSObject()[
      uiConfigs.localStorageLogsObjectKeys.logHistory
    ]
    logHistory.reverse()
    dispatchLogPageAction(
      logPageActionCreators.initializeLogsAndCache(logHistory)
    )
  }, [])

  const filterLogs = useCallback((type) => {
    // filters logs array by the type passed in param
    dispatchLogPageAction(logPageActionCreators.filterLogs(type))
  }, [])

  const deleteLSLogHistory = useCallback(() => {
    // clears local storage log history and both logs and cache arrays in reducer.
    deleteAndGetLSObject({
      key: uiConfigs.localStorageLogsObjectKeys.logHistory
    })
    dispatchLogPageAction(logPageActionCreators.clearLogsAndCache())
  }, [])

  // unite all values to be provided by this context into an object
  const passedContext = {
    logPageState,
    dispatchLogPageAction,
    updateLSandGetLSasJSObj,
    mountLogs,
    filterLogs,
    deleteLSLogHistory
  }

  return (
    <LogContext.Provider value={passedContext}>{children}</LogContext.Provider>
  )
}
