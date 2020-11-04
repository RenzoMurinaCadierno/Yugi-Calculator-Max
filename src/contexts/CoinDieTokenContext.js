import React, { createContext, useReducer } from "react"
import { v4 as uuidv4 } from "uuid"
import useLogReducer from "../hooks/useLogReducer"
import coinDieTokenReducer from "../store/CoinDieToken/coinDieTokenReducer"
import uiConfigs from "../utils/ui.configs.json"
import spellIcon from "../assets/tokenIcons/spell.svg"

export const CoinDieTokenContext = createContext({
  coinReducer: [],
  diceReducer: [],
  tokenReducer: [],
  coinLogReducer: [],
  diceLogReducer: []
})

export function CoinDieTokenContextProvider({ children }) {
  // initialize an instance of the reducer for coin objects
  const coinReducer = useReducer(coinDieTokenReducer, {
    items: [{ id: uuidv4(), res: "", alt: "" }]
  })
  // a different one for die objects
  const diceReducer = useReducer(coinDieTokenReducer, {
    items: [{ id: uuidv4(), res: [] }]
  })
  // and a last one for token objects
  const tokenReducer = useReducer(coinDieTokenReducer, {
    items: [
      {
        id: uuidv4(),
        counter: 1,
        alt: "Token type 1",
        img: spellIcon,
        isActive: true
      }
    ]
  })
  // same with log reducers. We need one for coin and one for dice, as
  // they track different states (we can log them independently. One can
  // be on and the other off, no problems)
  const coinLogReducer = useLogReducer(
    uiConfigs.localStorageLogsObjectKeys.logHistory,
    null,
    {
      logState: false,
      logType: "",
      logText: "",
      logIgTimer: "",
      logPing: false
    }
  )

  const diceLogReducer = useLogReducer(
    uiConfigs.localStorageLogsObjectKeys.logHistory,
    null,
    {
      logState: false,
      logType: "",
      logText: "",
      logIgTimer: "",
      logPing: false
    }
  )
  // unite all values to be provided by this context into an object
  const passedContext = {
    coinReducer,
    diceReducer,
    tokenReducer,
    coinLogReducer,
    diceLogReducer
  }

  return (
    <CoinDieTokenContext.Provider value={passedContext}>
      {children}
    </CoinDieTokenContext.Provider>
  )
}
