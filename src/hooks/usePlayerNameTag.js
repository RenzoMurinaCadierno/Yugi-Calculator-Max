import { useState, useEffect } from "react"
import useToggle from "./useToggle"
import { InputValidator } from "../utils/validators"

export default function usePlayerNameTag({
  contextPlayerName, // The target player name as a string, from PlayerContext
  updateContextPlayerNames, // setPlayerNames function (does not override the other player's name)
  contextCurrentPlayer, // "p1" or "p2"
  inputReference, // the target input reference
  maxPlayerNameLength, // max name's length
  soundEffects // a useAudio() SFX object with two sources as tracks
}) {
  // state to control input edit toggling.
  const [isEditingInput, toggleEditingInput] = useToggle(false)
  // tag.name will hold the player name to be edited, and tag.fallback
  // its previous state. If the edit is unsuccessful, then tag.name will
  // be set to tag.fallback
  const [tag, setTag] = useState({
    name: contextPlayerName,
    fallback: contextPlayerName
  })

  function submitNewName() {
    const trimmedName = tag.name.trim()
    // on an invalid name or a string of only empty spaces
    if (
      !new InputValidator(tag.name).isValidPlayerName() ||
      !trimmedName.length
    ) {
      // set name to its previous state and play the "cancel" sfx
      setTag({ ...tag, name: tag.fallback })
      soundEffects.setNextSrc(1)
      soundEffects.play()
      // on a valid name
    } else {
      // if the submitted name is not equal to its previous state
      if (!(trimmedName === tag.fallback)) {
        // set both name and previous state to the new value, update LocalStorage
        // to persist changes and play the "OK" sfx
        setTag({ name: trimmedName, fallback: trimmedName })
        updateContextPlayerNames({ [contextCurrentPlayer]: trimmedName })
        soundEffects.setNextSrc(0)
        soundEffects.play()
      }
    }
    // on all cases, close the editing state
    toggleEditingInput()
  }

  function handleInputChange(e) {
    // do not exceed the maximim player length
    if (e.target.value.length > maxPlayerNameLength) return
    // control the input by the name key in tag state
    setTag({
      ...tag,
      name: e.target.value
    })
  }

  useEffect(() => {
    // whenever we start editing, set focus on the input, if any
    isEditingInput && inputReference.current && inputReference.current.focus()
  }, [isEditingInput, inputReference])

  return {
    name: tag.name,
    isEditingInput,
    toggleEditingInput,
    submitNewName,
    handleInputChange
  }
}
