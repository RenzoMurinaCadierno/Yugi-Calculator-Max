import React, { memo, useCallback, useContext } from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import SVGImageWithNotifications from "../../UI/SVGImageWithNotifications/SVGImageWithNotifications"
import deck from "../../../assets/uiIcons/deck.svg"
import save from "../../../assets/uiIcons/save.svg"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./DeckSelectionAndEditing.utils"
import styles from "./DeckSelectionAndEditing.module.css"

function DeckSelectionAndEditing({
  canSave // <boolean> deckConstructor reducer's "canSave" boolean
}) {
  // clicking on <SVGImageWithNotifications /> will trigger a secondary screen
  const { toggleSecondScreen } = useContext(UIContext)
  // on SVGImageWithNotifications's container click, toggle its secondary screen
  const handleClick = useCallback(() => {
    toggleSecondScreen(uiConfigs.togglers.secondaryScreens.selectOrEditDeck)
  }, [toggleSecondScreen])

  return (
    <SVGImageWithNotifications
      src={deck}
      alt="Deck menu icon"
      onClick={handleClick}
      miniCircleTrigger={canSave}
      miniCirclePosition="bottom-left"
      miniCircleDisplay={
        <img src={save} alt="save changes" className={styles.MiniCircleImage} />
      }
      role="button"
      ariaLabel="Click to open a menu with all your created decks, or to create a new one"
      classNames={classes.svgImageWithNotification}
    />
  )
}

DeckSelectionAndEditing.propTypes = {
  canSave: PropTypes.bool.isRequired
}

export default memo(DeckSelectionAndEditing)
