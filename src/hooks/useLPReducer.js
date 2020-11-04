import { useReducer, useEffect, useContext } from "react"
import { LocalStorageContext } from "../contexts/LocalStorageContext"
import lpReducer from "../store/LifePoints/lifePointsReducer"
import uiConfigs from "../utils/ui.configs.json"

export default function useLPReducer() {
  // grab current lifepoints in LocalStorage object (retrieved by LocalStorageContext)
  // at mount, and create the reducer with that and temporal life points as state
  const { currentLP, updateLSandGetLSasJSObj } = useContext(LocalStorageContext)
  const [lpState, dispatchLPAction] = useReducer(lpReducer, {
    ...currentLP,
    tempLP: uiConfigs.tempLP.init
  })

  // at any time lifepoints of any player are modified, update LocalStorage with the new values
  useEffect(() => {
    updateLSandGetLSasJSObj({
      key: uiConfigs.localStorageConfigsObjectKeys.currentLP,
      value: { p1: lpState.p1, p2: lpState.p2 },
      overrideValue: true
    })
  }, [lpState.p1, lpState.p2, updateLSandGetLSasJSObj])

  return [lpState, dispatchLPAction]
}
