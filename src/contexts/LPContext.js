import React, { createContext, useState } from "react"
import useLPReducer from "../hooks/useLPReducer"
import useLogReducer from "../hooks/useLogReducer"
import uiConfigs from "../utils/ui.configs.json"

export const LPContext = createContext({
  lpState: {},
  dispatchLPAction: () => {},
  switchState: false,
  setSwitch: () => {},
  lpLog: {},
  dispatchLogAction: () => {}
})

export function LPContextProvider({ children }) {
  // grab lifepoints state and action dispatcher from its specific reducer hook
  const [lpState, dispatchLPAction] = useLPReducer()
  // create a context-handled state for lifepoints logging, since it is needed
  // across components.
  const [switchState, setSwitch] = useState(false)
  // generate a log reducer state and action dispatcher for lifepoints actions
  const [lpLog, dispatchLogAction] = useLogReducer(
    uiConfigs.localStorageLogsObjectKeys.logHistory,
    null,
    {
      logState: false,
      logType: "",
      logText: "",
      logIgTimer: ""
    }
  )
  // join everything that needs to be passed across components as context
  const passedContext = {
    lpState,
    dispatchLPAction,
    switchState,
    setSwitch,
    lpLog,
    dispatchLogAction
  }
  // and return the provider with that context object
  return (
    <LPContext.Provider value={passedContext}>{children}</LPContext.Provider>
  )
}
