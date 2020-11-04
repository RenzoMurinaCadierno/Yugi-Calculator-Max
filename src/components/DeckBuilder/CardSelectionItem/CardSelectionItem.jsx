import React, { useCallback, useRef } from "react"
import PropTypes from "prop-types"
import useToggle from "../../../hooks/useToggle"
import MiniCircleWithTransition from "../../UI/MiniCircleWithTransition/MiniCircleWithTransition"
import { getCardTypeStyle } from "../../../utils/yugiohSpecificFunctions"
import info from "../../../assets/uiIcons/info.svg"
import { classes } from "./CardSelectionItem.utils"
import styles from "./CardSelectionItem.module.css"

export default function CardSelectionItem({
  card, // <object> Card object with its name, quantity and type
  onAddCircleClick, // <function> "+1" MiniCircle onClick's callback
  onInfoCircleClick // <function> "i" (info) MiniCircle onClick's callback
}) {
  // we only need to calculate "color" styles once. Store it in a referece so
  // it prevails between components (it does not re-calculate on re-render)
  const cardColor = useRef({ color: getCardTypeStyle(card.type, 1) })
  // boolean and toggler to show/hide MiniCircles
  const [showMiniCircles, toggleMiniCircles] = useToggle(false)

  const handleAddCircleClick = useCallback(() => {
    // card object must bubble up, so pass it as args to function in props
    onAddCircleClick(card)
  }, [onAddCircleClick, card])

  const handleInfoCircleClick = useCallback(() => {
    // same as handleAddCircleClick
    onInfoCircleClick(card)
  }, [onInfoCircleClick, card])

  return (
    <li
      style={cardColor.current}
      tabIndex={0}
      onFocus={toggleMiniCircles}
      onBlur={toggleMiniCircles}
      className={styles.Container}
    >
      {card.name}
      <MiniCircleWithTransition
        triggerOn={showMiniCircles} // render component on showMiniCircles = true
        display="+1"
        animateOnClick // "grow" animation in MiniCircle will play on click
        role="button"
        ariaLabel="Add card"
        onClick={handleAddCircleClick}
        classNames={classes.addMiniCircle}
      />
      <MiniCircleWithTransition
        triggerOn={showMiniCircles}
        display={<img src={info} alt="card info" className={styles.InfoIcon} />}
        animateOnClick
        role="button"
        onClick={handleInfoCircleClick}
        classNames={classes.infoMiniCircle}
      />
    </li>
  )
}

CardSelectionItem.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }),
  onAddCircleClick: PropTypes.func.isRequired,
  onInfoCircleClick: PropTypes.func.isRequired
}
