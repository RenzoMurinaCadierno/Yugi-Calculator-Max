import { useState, useCallback } from "react"

export default function useToggleSecondScreen() {
  const [secondScreenType, setType] = useState("")
  const [secondScreenState, setSecondScreenState] = useState(false)

  const toggleSecondScreen = useCallback(
    (screenType = "") => {
      // if secondScreen is open, close it (set its state to false)
      if (secondScreenState) return setSecondScreenState(false)
      // if its type is different from the one that triggered it lastly,
      // set the type to the one that is currently opening the secondScreen.
      if (secondScreenType !== screenType) setType(screenType)
      // finally, set its state to true, opening the modal screen
      setSecondScreenState(true)
    },
    [secondScreenType, secondScreenState]
  )

  return { secondScreenType, secondScreenState, toggleSecondScreen }
}
