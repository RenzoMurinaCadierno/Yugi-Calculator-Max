import { useEffect, useContext, useReducer } from "react"
import { v4 as uuid } from "uuid"
import { LogContext } from "../contexts/LogContext"
import logReducer from "../store/Log/logReducer"
import { getIRLDateTimeString } from "../utils/utilityFunctions"

export default function useLogReducer(key, nestedKey = null, initialState) {
  // pull local storage update function from LogContext
  const { updateLSandGetLSasJSObj } = useContext(LogContext)
  // get a reducer state and action dispatcher using logReducer and the
  // assigned initial state
  const [log, logDispatch] = useReducer(logReducer, initialState)
  // decompose the state into their variables
  const { logState, logType, logText, logIgTimer, logPing } = log

  useEffect(() => {
    // do nothing if we have no logState (we are not supposed to log the action),
    // or an invalid log type.
    if (!logState || !logType) return
    // proceed to update LocalStorage
    updateLSandGetLSasJSObj({
      key,
      nestedKey,
      value: {
        type: logType,
        text: logText,
        timer: logIgTimer,
        irlTime: getIRLDateTimeString(),
        id: uuid() // values need to be different from each other. Use unique ids
      },
      // if max log length is reached, the first item will be removed to make space
      // for the new log item to be stored
      unshiftFirstItem: true
    })
  }, [
    logState,
    logType,
    logText,
    updateLSandGetLSasJSObj,
    key,
    nestedKey,
    logIgTimer,
    logPing // on each log state change, ping on state will trigger this useEffect
  ])

  return [log, logDispatch]
}
