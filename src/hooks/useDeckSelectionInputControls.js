import { useCallback, useState } from "react"
import { InputValidator } from "../utils/validators"
import uiConfigs from "../utils/ui.configs.json"

export default function useDeckSelectionInputControls(configs = {}) {
  const {
    initialValue, // <string> starting <input> and <span>'s value
    toggler, // <function> toggler that sets whether <input> or <span> is shown
    soundEffects, // <object> containing 2 useAudio() controls objects ("OK" and "cancel")
    onEditSuccess // <function> on valid input submit callback
  } = configs
  // "value" is the actual <input> (and <span>) value, controlled by state here.
  // "fallback" holds a copy of the last valid <input> value. If at any time the
  // typed value in <input> is invalid, it will "fall back" to this
  const [value, setValue] = useState(initialValue ?? "Deck name")
  const [fallback, setFallback] = useState(initialValue ?? "Deck name")

  const handleInputChange = useCallback((e) => {
    // on each keystroke, check if the typed value follows the rules for deck
    // naming. If so, update value in state with it
    new InputValidator(e.target.value).isValidDeckName(
      uiConfigs.deckBuilderConfigs.maxDeckNameCharLength
    ) && setValue(e.target.value)
  }, [])

  const handleInputSubmit = useCallback((inputReference) => {
    // given the passed input reference (needed), blur it.
    // That triggers handleInputBlur()
    inputReference.current.blur()
  }, [])

  const handleInputBlur = useCallback(() => {
    // first, we need the trimmed value in current input state. This prevents
    // validation of an empty string, or strings with additional empty characters
    const trimmedValue = value.trim()
    // assign "cancel" sfx to audioTrack variable. Will switch to "OK" sfx on a
    // valid input submission
    let audioTrack = soundEffects.clickCancelSFX
    // if the trimmed value is empty or it equals the previous input value,
    // re-set input value to the previous one (fallback)
    if (!trimmedValue || trimmedValue === fallback) {
      setValue(() => fallback)
      // otherwise, the input submission was valid. Set both value and fallback to
      // the submitted value, switch audioTrack to "OK" sfx, and if a callback
      // for a successful submission exists, trigger it
    } else {
      setValue(() => trimmedValue)
      setFallback(() => trimmedValue)
      audioTrack = soundEffects.clickOKSFX
      onEditSuccess && onEditSuccess(trimmedValue)
    }
    // if there was a <span> to <input> toggler assigned, call for it
    toggler && toggler()
    // and fire the current sfx
    audioTrack.restart()
  }, [value, fallback, toggler, soundEffects, onEditSuccess])

  const forceSetValue = useCallback(
    // if by any means we need to bypass checks and force the input's value,
    // we use this function. It automatically sets value and fallback to the
    // parameter passed to it
    (value) => {
      setValue(value)
      setFallback(value)
    },
    [setValue, setFallback]
  )

  return {
    value,
    handleInputChange,
    handleInputSubmit,
    handleInputBlur,
    forceSetValue
  }
}
