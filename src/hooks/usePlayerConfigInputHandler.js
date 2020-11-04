import { useState, useCallback } from "react"
import Validator, { InputValidator } from "../utils/validators"

export default function usePlayerConfigInputHandler(
  playerConfigLSTargetObj,
  initialConfigsFallbackObj,
  callbackToUpdateLocalStorage,
  soundEffects = {}
) {
  // is there a key for the targetted player config inside LS object? If so,
  // use it. Otherwise, grab it from uiConfigs defaults (fallbackObj)
  const playerConfigObject =
    !!playerConfigLSTargetObj && !!Object.keys(playerConfigLSTargetObj).length
      ? playerConfigLSTargetObj
      : initialConfigsFallbackObj
  // LS parses string values, we need integers. Parse them.
  const playerConfigEntries = Object.entries(playerConfigObject).reduce(
    (acc, current) => {
      return { ...acc, [current[0]]: Number.parseInt(current[1]) }
    },
    {}
  )
  // create state for both player config values and fallback values, which will
  // reset the inputs to their previous state if an invalid value is passed.
  // Invalid values are 0 or an empty string.
  const [configState, setConfigState] = useState(playerConfigEntries)
  const [fallbackValues, setFallBackValues] = useState(playerConfigEntries)

  const updateLSWithPlayerConfigs = useCallback(
    (
      { target: { name, value } },
      localStorageKeyToUpdate,
      nestedKeyIfAny = null,
      rules = {}
    ) => {
      // on an empty string or a 0 as input value, use the fallback value
      const convertedValue =
        !value || Number.parseInt(value) === 0
          ? fallbackValues[name]
          : Number.parseInt(value)
      // are there any additional rules that inputs should follow?
      if (Object.keys(rules).length) {
        // do we have to reverse values? (e.g.: on dice min and max, if the input
        // supplied for the minimum value surpasses the currently set maximum)
        if (rules.reverseInputs) {
          // apply the rule that reverses them
          const updatedInputStates = new InputValidator(
            rules.inputRefOne,
            rules.inputRefTwo
          ).reverseInputs(name, convertedValue, configState)
          // values for both inputs changed, so update their states and fallback values
          setConfigState({
            ...configState,
            ...updatedInputStates
          })
          setFallBackValues({
            ...fallbackValues,
            ...updatedInputStates
          })
          // now, we will update LocalStorage only if these updated input states and
          // previous fallback values are different from each other. Otherwise, there
          // is no need to do so. Keep in mind new fallback values being updated
          // above are in batch, not yet updated. So we are effectively working with
          // the previous ones here
          if (
            !new Validator(
              updatedInputStates,
              fallbackValues
            ).objectsAreShallowlyEqual()
          ) {
            soundEffects.ok.play()
            callbackToUpdateLocalStorage({
              key: localStorageKeyToUpdate,
              nestedKey: nestedKeyIfAny,
              value: { ...configState, ...updatedInputStates },
              overrideValue: true
            })
          } else {
            soundEffects.cancel.play()
          }
        }
        // we finished updating state and LS for input fields with rules
        return
      }
      // there are no additionaly rules to follow and values are correctly converted
      // for the current input, so update its state and sync its fallback value
      setConfigState({
        ...configState,
        [name]: convertedValue
      })
      setFallBackValues({ ...fallbackValues, [name]: convertedValue })
      // it might happen that the updated value matches the current fallback (e.g.:
      // the user typed a value equal to the previous one). No need to update LS.
      // Note: at this exact time, neither setConfigState nor setFallBackValues
      // resolved as they are queued, so fallbackValues are still the same to compare.
      // However, if triggered, callbackToUpdateLocalStorage will be enqueued after them,
      // resolving in a successful order thus updating LS correctly.
      if (convertedValue !== fallbackValues[name]) {
        soundEffects.ok.play()
        callbackToUpdateLocalStorage({
          key: localStorageKeyToUpdate,
          nestedKey: nestedKeyIfAny,
          value: configState,
          overrideValue: true
        })
      } else {
        soundEffects.cancel.play()
      }
    },
    [configState, fallbackValues, callbackToUpdateLocalStorage, soundEffects]
  )

  const handleInputChange = useCallback(
    ({ target: { name, value } }, highestAllowedInputLength) => {
      const inputValidator = new InputValidator(value)
      // only integers allowed, and no more than highestAllowedInputLength digits
      if (
        inputValidator.lengthIsHigherThan(highestAllowedInputLength) ||
        !inputValidator.stringOnlyHasIntegers()
      ) {
        return
      }

      // localStorage works with integers, input returns string. Parse it.
      const convertedValue = Number.parseInt(value)

      // if we try to convert and empty string, we get NaN, but we still need to
      // show an empty string for the user while typing, that's why we keep it to
      // convert it at validation. Otherwise, we convert it here.
      setConfigState({
        ...configState,
        [name]: isNaN(convertedValue) ? "" : convertedValue
      })
    },
    [configState]
  )

  // with a form submission, we handle not only manual user blurs, but
  // also when they hit "ENTER" or "RETURN" while on an input.
  const handleSubmit = useCallback((e, inputReference) => {
    e.preventDefault()
    inputReference.current.blur()
  }, [])

  return {
    configState,
    handleInputChange,
    handleSubmit,
    updateLSWithPlayerConfigs
  }
}
