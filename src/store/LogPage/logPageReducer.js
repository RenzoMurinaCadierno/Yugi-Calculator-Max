import * as logPageActionTypes from "./logPageActionTypes"

const initialState = {
  logs: [],
  cache: [],
  activeIcon: "all"
}

export default function logPageReducer(state = initialState, action) {
  switch (action.type) {
    case logPageActionTypes.FILTER_LOGS:
      // do nothing if the same icon is clicked
      if (state.activeIcon === action.payload) return state
      // cache holds a copy of all logs. Set logs array with it if payload is "all"
      else if (action.payload === "all") {
        return {
          ...state,
          logs: state.cache,
          activeIcon: action.payload
        }
      }
      // on a "reverse" payload, reverse the current log list and set it as state
      else if (action.payload === "reverse") {
        const reversedLogs = [...state.logs].reverse()
        return {
          ...state,
          logs: reversedLogs
        }
      }
      // if we are not clicking in the same icon, nor trying to display all logs
      // or reversing them, then we are attempting to filter by log types
      // "timer", "lp", "coin" and "dice". So, filter the cache (as it will always
      // contain a copy of all logs), and set logs state with the result.
      const filteredLogs = state.cache.filter(
        (log) => log.type === action.payload
      )
      return {
        ...state,
        logs: filteredLogs,
        activeIcon: action.payload
      }

    case logPageActionTypes.CLEAR_LOGS_AND_CACHE:
      // override logs and cache state to an empty array
      return {
        ...state,
        logs: [],
        cache: []
      }

    case logPageActionTypes.INITIALIZE_LOGS_AND_CACHE:
      // sync both logs and cache to hold the same log array
      return {
        ...state,
        logs: action.payload,
        cache: action.payload
      }

    default:
      return state
  }
}
