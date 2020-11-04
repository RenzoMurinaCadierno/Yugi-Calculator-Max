import * as logPageActionTypes from "./logPageActionTypes"

// logType: <string> "lp", "dice", "coin", "timer", "reverse" or "all"
export const filterLogs = (logType) => ({
  type: logPageActionTypes.FILTER_LOGS,
  payload: logType
})

export const clearLogsAndCache = () => ({
  type: logPageActionTypes.CLEAR_LOGS_AND_CACHE
})

// logArray: <Array> array with all log objects coming from local storage
export const initializeLogsAndCache = (logArray) => ({
  type: logPageActionTypes.INITIALIZE_LOGS_AND_CACHE,
  payload: logArray
})
