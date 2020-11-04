import React, { useState, useCallback, memo } from "react"
import PropTypes from "prop-types"
import Button from "../../UI/Button/Button"
import { classes } from "./DeckButton.utils"

function DeckButton({
  children,
  deckId, // <number> the deck's id in DeckConstructor reducer object ("deck_<id>")
  canSave, // <boolean> on true, the deck was modified. False means the deck was saved
  isActiveDeck, // <boolean> True indicates the deck corresponding to the button is loaded
  isDemoComponent, // <boolean> True cycles through clickstates triggering no onClick callbacks
  onClick, // <function> <Button />'s onClick handler
  ariaPressed, // <string> True on clickState !== 0
  classNames // <Array> an array of className strings
}) {
  // text state and handler for text displayed on different clickStates
  const [text, setText] = useState(children)
  // click state and handler (0 = not clicked, 1 = clicked)
  const [clickState, setClickState] = useState(0)

  const handleBlur = useCallback(() => {
    // if we blur out of the clicked (active) <Button />, set it as not clicked
    // and return its children to default
    setClickState(0)
    setText(children)
  }, [setText, setClickState, children])

  function handleClick() {
    // upon clicking, if target clickState === 0
    if (!clickState) {
      // given the case we clicked on an already loaded deck, set its text to
      // indicate it. Otherwise, tell the user clicking again will load it
      setText(
        isActiveDeck ? "Deck is currently active" : "Click again to load deck"
      )
      // also, set the currently clicked button's state to 1 (clicked once)
      setClickState(1)
    }
    // Demo component is in <DeckHelp />, which only serves as a visual indicator
    // of how to load a deck, and its onClick callback is null
    isDemoComponent && clickState > 0 && setText("Deck loaded!")
    // call upon onClick's callback
    onClick(deckId, clickState, canSave, isActiveDeck)
  }

  return (
    <Button
      type={clickState ? "primary" : "secondary"}
      nonStylesDisabled={isActiveDeck} // we need a disabled button without being grayed out
      sutileAnimation
      onBlur={handleBlur}
      onClick={handleClick}
      ariaPressed={ariaPressed}
      classNames={classes.button(classNames)}
    >
      {text}
    </Button>
  )
}

DeckButton.propTypes = {
  children: PropTypes.node.isRequired,
  deckId: PropTypes.number.isRequired,
  canSave: PropTypes.bool.isRequired,
  isActiveDeck: PropTypes.bool.isRequired,
  isDemoComponent: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  ariaPressed: PropTypes.bool.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string)
}

export default memo(DeckButton)
