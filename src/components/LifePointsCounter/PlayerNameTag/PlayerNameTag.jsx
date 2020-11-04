import React, { useRef, memo } from "react"
import PropTypes from "prop-types"
import usePlayerNameTag from "../../../hooks/usePlayerNameTag"
import useDoubleTap from "../../../hooks/useDoubleTap"
import InputWithSubmit from "../../UI/InputWithSubmit/InputWithSubmit"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes, inlineStyles } from "./PlayerNameTag.utils"

function PlayerNameTag({
  currentPlayer, // <string> Either "p1" or "p2"
  playerName, // <string> The target player name in PlayerContext
  setPlayerNames, // <function> playerName's setter function
  nameChangeSFX, // <object> useAudio() controls object with two sources (ok and cancel)
  classNames = {} // <object> classNames to apply to elements. Check propTypes below
}) {
  // a ref for the input. usePlayerNameTag needs it to focus on it
  const inputRef = useRef()
  // bring all states and handlers from usePlayerNameTag specific hook to
  // manage <InputWithSubmit />
  const {
    name,
    isEditingInput,
    toggleEditingInput,
    submitNewName,
    handleInputChange
  } = usePlayerNameTag({
    contextPlayerName:
      playerName || uiConfigs.initialPlayerNames[currentPlayer],
    updateContextPlayerNames: setPlayerNames,
    contextCurrentPlayer: currentPlayer,
    inputReference: inputRef,
    maxPlayerNameLength: uiConfigs.calcConfigs.playerNames.maxLength,
    soundEffects: nameChangeSFX
  })
  // bring the double tap/click hook and assign input toggling to it
  const call = useDoubleTap({
    delayBetweenTaps: uiConfigs.timeouts.doubleTapDelay
  })
  const handleDoubleTap = () => call(toggleEditingInput)

  // if we are on editing state, show the input and a span showing the
  // remaining available characters. If we are not editing, then just
  // show the span with the player name
  return isEditingInput ? (
    <>
      <InputWithSubmit
        value={name}
        reference={inputRef}
        preventDefault
        onChange={handleInputChange}
        onBlur={submitNewName}
        onSubmit={submitNewName}
        autocomplete="off"
        ariaLabel="Enter a new name"
        classNames={classes.inputWithSubmit(classNames.form, classNames.input)}
      />
      <span
        className={classes.charLimit(classNames.charLimit)}
        // adjust hue and brightness between primary and secondary as
        // an extra effect on remaining characters
        style={inlineStyles.editableSpan(name.length)}
      >
        {uiConfigs.calcConfigs.playerNames.maxLength - name.length}
      </span>
    </>
  ) : (
    <span
      data-id={currentPlayer}
      onClick={handleDoubleTap}
      aria-label="Player name. Click to edit"
      className={classes.span(classNames.span)}
    >
      {name}
    </span>
  )
}

PlayerNameTag.propTypes = {
  currentPlayer: PropTypes.string.isRequired,
  playerName: PropTypes.string,
  setPlayerNames: PropTypes.func.isRequired,
  nameChangeSFX: PropTypes.object.isRequired,
  classNames: PropTypes.shape({
    span: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(PlayerNameTag)
