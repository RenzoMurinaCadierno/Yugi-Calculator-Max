import React, { memo, useCallback, useRef, useEffect, useContext } from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import * as deckConstructorActionCreators from "../../../store/DeckConstructor/deckConstructorActionCreators"
import useDeckSelectionInputControls from "../../../hooks/useDeckSelectionInputControls"
import useToggle from "../../../hooks/useToggle"
import useAudio from "../../../hooks/useAudio"
import DeckSelectionAndEditing from "../DeckSelectionAndEditing/DeckSelectionAndEditing"
import EditableSpan from "../../UI/EditableSpan/EditableSpan"
import SVGImageWithNotifications from "../../UI/SVGImageWithNotifications/SVGImageWithNotifications"
import help from "../../../assets/uiIcons/help.svg"
import clickOKmp3 from "../../../assets/audios/clickOK.mp3"
import clickCancelmp3 from "../../../assets/audios/clickCancel.mp3"
import uiConfigs from "../../../utils/ui.configs.json"
import {
  classes,
  editableSpanConfigs,
  inputWithSubmitExtraProps
} from "./DeckSelectionAndHelpMenu.utils"
import styles from "./DeckSelectionAndHelpMenu.module.css"

function DeckSelectionAndHelpMenu({
  canSave, // <boolean> if the deck was modified, this will be true. If it was saved, false.
  deckId, // <number> the selected deck's integer value on deckState object
  deckOneNameChange, // <string> "deck_1"'s name. On change, component will re-render
  selectedDeckName, // <string> current selected deck's "name" key's value
  playSFXs, // <boolean> UIContext's ON/OFF sound effect switch
  dispatchDeckAction // <function> deckContructorReducer's action dispatcher
}) {
  // <HelpIcon /> triggers a Secondary Screen. Bring toggler from UIContext
  const { toggleSecondScreen } = useContext(UIContext)
  // toggler for EditableSpan's input
  const [isEditingInput, toggleEditingInput] = useToggle(false)
  // ref for EditableSpan's input
  const inputRef = useRef()
  // audio JSX and controls object for "confirm" and "OK" SFX
  const [clickOKAudioJSX, clickOKSFX] = useAudio(clickOKmp3, {
    toggleOn: playSFXs
  })
  // audio JSX and controls object for "cancel" SFX
  const [clickCancelAudioJSX, clickCancelSFX] = useAudio(clickCancelmp3, {
    toggleOn: playSFXs
  })
  // on form submit (or input blur), execute this callback to change deck's name
  const handleEditSuccess = useCallback(
    (newDeckName) =>
      dispatchDeckAction(
        deckConstructorActionCreators.setDeckName(newDeckName)
      ),
    [dispatchDeckAction]
  )
  // get the specific input controls to be used in this component
  const {
    value,
    handleInputChange,
    handleInputSubmit,
    handleInputBlur,
    forceSetValue
  } = useDeckSelectionInputControls({
    initialValue: selectedDeckName,
    toggler: toggleEditingInput,
    soundEffects: { clickOKSFX, clickCancelSFX },
    onEditSuccess: handleEditSuccess
  })
  // input submit will blur the input, which needs the reference to know what to blur
  const handleSubmit = useCallback(() => {
    handleInputSubmit(inputRef)
  }, [handleInputSubmit])
  // clicking on help icon toggles secondary screen for that specific help section
  const handleHelpIconClick = useCallback(() => {
    toggleSecondScreen(uiConfigs.togglers.secondaryScreens.deckCreatorHelp)
  }, [toggleSecondScreen])

  useEffect(() => {
    // only when switching between decks, we force a name update. Otherwise
    // the deck's name will not reflect its new current state as the custom
    // hook does not re-render automatically when its value is changed outside
    // of its control. Also, deleting the only 1 deck in state will not trigger
    // a deckId change to listen to, thus we add a specific deck name change
    // listener for it only (deckOneNameChange).
    forceSetValue(selectedDeckName)
  }, [deckId, deckOneNameChange])

  return (
    <>
      <div className={styles.CurrentSelectedDeck}>
        <DeckSelectionAndEditing canSave={canSave} />
        <EditableSpan
          display={value}
          isEditingInput={isEditingInput}
          toggleEditingInput={toggleEditingInput}
          inputReferece={inputRef}
          onInputChange={handleInputChange}
          onInputSubmit={handleSubmit}
          onInputBlur={handleInputBlur}
          configs={editableSpanConfigs}
          inputWithSubmitExtraProps={inputWithSubmitExtraProps}
          classNames={classes.editableSpan}
        />
      </div>
      <SVGImageWithNotifications
        src={help}
        alt="Click for help"
        text="Help"
        role="button"
        ariaLabel="Toggle help screen"
        onClick={handleHelpIconClick}
        classNames={classes.helpSvgComponent}
      />
      {clickOKAudioJSX}
      {clickCancelAudioJSX}
    </>
  )
}

DeckSelectionAndHelpMenu.propTypes = {
  canSave: PropTypes.bool.isRequired,
  deckId: PropTypes.number.isRequired,
  deckOneNameChange: PropTypes.string.isRequired,
  selectedDeckName: PropTypes.string.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  dispatchDeckAction: PropTypes.func.isRequired
}

export default memo(DeckSelectionAndHelpMenu)
