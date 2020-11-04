import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef
} from "react"
import { LocalStorageContext } from "./LocalStorageContext"
import usePlayerToggle from "../hooks/usePlayerToggle"
import uiConfigs from "../utils/ui.configs.json"

export const PlayerContext = createContext({
  currentPlayer: "",
  toggleCurrentPlayer: () => {},
  playerNames: {},
  setPlayerNames: () => {}
})

export function PlayerContextProvider({ children }) {
  const isMounting = useRef(true)
  // grab local storage getter and updating functions for "Configs" key.
  // We will work with playerConfigs.playerNames local storage entry
  const { getLSasJSObject, updateLSandGetLSasJSObj } = useContext(
    LocalStorageContext
  )
  // generate a player toggle hook to switch between "p1" and "p2" states
  const [currentPlayer, toggleCurrentPlayer] = usePlayerToggle()
  // state and setter to handle player keys and their assigned names as value.
  // {"p1": <name>, "p2": <name>}. At app's mount, try fetching them from
  // local storage. If they exist, set them as state. Otherwise, use the
  // default values from uiConfigs
  const [playerNames, setNames] = useState(() => {
    const { playerConfigs } = getLSasJSObject()
    return playerConfigs?.playerNames ?? uiConfigs.initialPlayerNames
  })

  const setPlayerNames = useCallback(
    // setter function used by usePlayerNameTag hook. It gets an object with
    // the current active player as key and their name as value, and
    // updates the fragment of state concerning that specific player only
    (playerNameObject) =>
      setNames((playerNames) => ({ ...playerNames, ...playerNameObject })),
    []
  )

  useEffect(() => {
    // do nothing at mount since player names were already loaded from local
    // storage by LocalStorageContextProvider.js, but after that, each time
    // a player name in <LifePointsGauge /> changes, update the corresponding
    // local storage key with that new value
    if (isMounting.current) isMounting.current = false
    else
      updateLSandGetLSasJSObj({
        key: uiConfigs.localStorageConfigsObjectKeys.playerConfigs,
        nestedKey: "playerNames",
        value: { [currentPlayer]: playerNames[currentPlayer] }
      })
  }, [playerNames])

  // unite all values to be provided by this context into an object
  const passedContext = {
    currentPlayer,
    toggleCurrentPlayer,
    playerNames,
    setPlayerNames
  }

  return (
    <PlayerContext.Provider value={passedContext}>
      {children}
    </PlayerContext.Provider>
  )
}
