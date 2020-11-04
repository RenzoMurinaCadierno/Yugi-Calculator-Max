import React, { createContext } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import uiConfigs from "../utils/ui.configs.json"

export const LocalStorageContext = createContext({
  logHistory: [],
  currentLP: {},
  playerConfigs: {},
  initialLPLog: {},
  getLSasJSObject: () => {},
  updateLSandGetLSasJSObj: () => {},
  deleteAndGetLSObject: () => {}
})

export function LocalStorageContextProvider({ children }) {
  // initialize a local storage handler hook for "Configs". It will manage
  // currently active life points, dice ranges, life points limits and
  // player names across components and app reloads
  const {
    getLSasJSObject,
    updateLSandGetLSasJSObj,
    deleteAndGetLSObject
  } = useLocalStorage(
    uiConfigs.localStorageConfigsKeyName,
    uiConfigs.initialConfigsLocalStorage
  )
  // grab last-loaded in-calculator lifepoints and player names, life points
  // limits, player names and dice ranges (if any) from local storage
  const { currentLP, playerConfigs } = getLSasJSObject()
  // unite all values to be provided by this context into an object
  const passedContext = {
    currentLP,
    playerConfigs,
    initialLPLog: uiConfigs.initialLPLog,
    getLSasJSObject,
    updateLSandGetLSasJSObj,
    deleteAndGetLSObject
  }

  return (
    <LocalStorageContext.Provider value={passedContext}>
      {children}
    </LocalStorageContext.Provider>
  )
}
