import React, { useCallback } from "react"
import PropTypes from "prop-types"
import OptionsTitle from "../../../wrappers/OptionsTitle/OptionsTitle"
import Spinner from "../../UI/Spinner/Spinner"
import MiniCircleWithTransition from "../../UI/MiniCircleWithTransition/MiniCircleWithTransition"
import { classes, getComponentProperties } from "./SaveDeleteOrAddDeck.utils"
// import styles from "./SaveDeleteOrAddDeck.module.css"

export default function SaveDeleteOrAddDeck({
  isSaveDeckComponent, // <boolean> on true, we are rendering a save deck component
  isDeleteDeckComponent, // <boolean> on true, we are rendering a delete deck component
  isAddDeckComponent, // <boolean> on true, we are rendering an add deck component
  currentOperation, // <string> "saving", "adding" or "deleting"
  clickedDeckId, // <number> the id of <DeckMenu />'s clicked <Button />
  handleDeckChange, // <function> this component's <MiniCircle /> onClick callback
  canSave, // <boolean> current selected deck's save state (true === modified but unsaved)
  deckLimitwasReached, // <boolean> true means no more decks can added by Add Deck
  classNames = {} // <object> classNames keys and values. Check them in propTypes below
}) {
  // cmpProps will store all particular props needed to render this component's JSX
  // depending on the type of component being requested from parent
  const cmpProps = getComponentProperties(
    isSaveDeckComponent,
    isDeleteDeckComponent,
    isAddDeckComponent
  )

  const changeOperationState = useCallback(() => {
    // trigger parent's deckChange callback with the respective operation string.
    // This will summon useEffect() there, listening to operation changes
    handleDeckChange(cmpProps.operation)
  }, [handleDeckChange, cmpProps.operation])

  return (
    <>
      <OptionsTitle classNames={classes.title(classNames.title)}>
        {cmpProps.title}
      </OptionsTitle>
      {
        // on "save deck" component and "saving" operation, we are saving a
        // deck in local storage. Render a <Spinner /> as we wait
        isSaveDeckComponent && currentOperation === "saving" ? (
          <Spinner classNames={classes.spinner(classNames.spinner)} />
        ) : (
          // otherwise, always render a <MiniCircle /> to click on
          <MiniCircleWithTransition
            triggerOn={
              isSaveDeckComponent
                ? canSave // on "save deck" component, show if there are unsaved changes in current deck
                : isDeleteDeckComponent
                ? !!clickedDeckId // on "delete deck" component, show if clickedDeckId > 0, meaning there is more than 1 deck
                : !deckLimitwasReached // on "add deck" component, show if deck quantity limit was not reached
            }
            animateOnClick
            onClick={changeOperationState}
            display={
              <img
                src={cmpProps.src}
                alt={cmpProps.alt}
                className={classes.miniCircleImg(
                  isDeleteDeckComponent,
                  isAddDeckComponent,
                  classNames.miniCircleImg
                )}
              />
            }
            classNames={classes.miniCircle(classNames.miniCircle)}
          />
        )
      }
      {
        // for "save deck" component, show disabled text if changes were already
        // saved and current operation was resetted (is null)
        isSaveDeckComponent && !canSave && !currentOperation && (
          <span className={classes.disabledText(classNames.disabledText)}>
            {cmpProps.disabledText}
          </span>
        )
      }
      {
        // for "delete deck" component, show disabled text if we are not already
        // attempting to delete a deck (currentOperation !== "deleting"), and
        // clickedDeckId > 1 (Default deck is id 0, so it cannot be deleted)
        isDeleteDeckComponent &&
          currentOperation !== "deleting" &&
          !!!clickedDeckId && (
            <span className={classes.disabledText(classNames.disabledText)}>
              {cmpProps.disabledText}
            </span>
          )
      }
      {
        // for "add deck" component, show disabled text if we exceeded the maximum
        // amount of decks we can create
        isAddDeckComponent && deckLimitwasReached && (
          <span className={classes.disabledText(classNames.disabledText)}>
            {cmpProps.disabledText}
          </span>
        )
      }
    </>
  )
}

SaveDeleteOrAddDeck.propTypes = {
  isSaveDeckComponent: PropTypes.bool,
  isDeleteDeckComponent: PropTypes.bool,
  isAddDeckComponent: PropTypes.bool,
  currentOperation: PropTypes.string,
  clickedDeckId: PropTypes.number,
  handleDeckChange: PropTypes.func.isRequired,
  canSave: PropTypes.bool,
  deckLimitwasReached: PropTypes.bool,
  classNames: PropTypes.shape({
    title: PropTypes.arrayOf(PropTypes.string),
    miniCircle: PropTypes.arrayOf(PropTypes.string),
    miniCircleImg: PropTypes.arrayOf(PropTypes.string),
    disabledText: PropTypes.arrayOf(PropTypes.string)
  })
}
