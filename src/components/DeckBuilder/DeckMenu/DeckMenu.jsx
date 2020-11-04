import React, { useState, useCallback, memo } from "react"
import PropTypes from "prop-types"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import OptionsTitle from "../../../wrappers/OptionsTitle/OptionsTitle"
import DeckButton from "../DeckButton/DeckButton"
import { getSlicedString } from "../../../utils/utilityFunctions"
import { classes } from "./DeckMenu.utils"

function DeckMenu({
  deckState, // <object> DeckConstructor's reducer state
  clickedDeckId, // <number> id of <DeckButton /> being clicked on
  setClickedDeckId, // <function> clicked deck's id setter
  dispatchToastAction, // <function> UIContext's Toast reducer action dispatcher
  onSwitchDeck, // <function> switch deck's handler
  classNames = {} // <object> classNames keys and values. Check them in propTypes below
}) {
  // boolean state and setter to trigger Toast to warn of unsaved changes
  const [hasWarnedUnsavedChanges, setHasWarnedUnsavedChanges] = useState(false)

  const handleDeckButtonClick = useCallback(
    (deckId, clickState, canSave, isActiveDeck) => {
      // clickState !== 0 means clicked <DeckButton /> was clicked on once before,
      // so if that <DeckButton /> is not the one associated to the currently loaded
      // deck (active), call the handler to switch to it (load it)
      if (clickState) {
        !isActiveDeck && onSwitchDeck(deckId)
      } else {
        // otherwise, set clickedDeckId state to the Deck Button being clicked on
        setClickedDeckId(deckId)
        // check whether the deck is !== active deck, changes were unsaved and we
        // did not warn the user before.
        if (
          !clickState &&
          canSave &&
          !isActiveDeck &&
          !hasWarnedUnsavedChanges
        ) {
          // On all cases as true, warn the user of unsaved changes with a Toast
          dispatchToastAction(
            toastActionCreators.setToastState(
              "Psst! You have unsaved changes in the current deck. Save or they will be lost!",
              null,
              null
            )
          )
          // and flag the component as having already warned the user (as not to bother)
          setHasWarnedUnsavedChanges(true)
        }
      }
    },
    [
      hasWarnedUnsavedChanges,
      dispatchToastAction,
      setHasWarnedUnsavedChanges,
      onSwitchDeck
    ]
  )

  return (
    <>
      <OptionsTitle classNames={classes.title(classNames.title)}>
        Deck select
      </OptionsTitle>
      <div className={classes.deckSelect(classNames.deckSelect)}>
        {Object.entries(deckState).map((keyVal) => {
          // map all entries in DeckConstructor's reducer state and generate
          // <DeckButton /> components only for those entries that match "deck_<id>"
          return keyVal[0].slice(0, 5) === "deck_" ? (
            <DeckButton
              key={keyVal[0]} // <deck_<id> do not repeat themselves
              deckId={+keyVal[0][5]} // fifth char is always the <id>
              canSave={deckState.canSave}
              isActiveDeck={
                // if selected deck's id in state matches the id of the mapped key,
                // it means we are standing on the currently loaded active object
                Number.parseInt(keyVal[0][5]) === deckState.selectedDeckId
              }
              onClick={handleDeckButtonClick}
              ariaPressed={Number.parseInt(keyVal[0][5]) === clickedDeckId}
              classNames={classes.button(classNames.button)}
            >
              {
                // viewport's limitations forces us to cut the string.
                // Try it yourself by typing 24 "@" as a deck name.
                getSlicedString(keyVal[1].name, 24, "...")
              }
            </DeckButton>
          ) : null
        })}
      </div>
    </>
  )
}

DeckMenu.propTypes = {
  deckState: PropTypes.object.isRequired,
  clickedDeckId: PropTypes.number.isRequired,
  setClickedDeckId: PropTypes.func.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  onSwitchDeck: PropTypes.func.isRequired,
  classNames: PropTypes.shape({
    title: PropTypes.arrayOf(PropTypes.string),
    select: PropTypes.arrayOf(PropTypes.string),
    button: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(DeckMenu)
