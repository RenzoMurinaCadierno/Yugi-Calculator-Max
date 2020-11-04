import React, { useCallback } from "react"
import PropTypes from "prop-types"
import AnimatedNumber from "animated-number-react"
import MiniCircleWithTransition from "../../UI/MiniCircleWithTransition/MiniCircleWithTransition"
import { getSlicedString } from "../../../utils/utilityFunctions"
import { classes } from "./CardListStatsItem.utils"
import styles from "./CardListStatsItem.module.css"

export default function CardListStatsItem({
  cardObj, // <object> card object to be rendered in this component
  drawChance, // <number> this card's quantity / card total, as float rounded to 2 decimals
  cardStyle // <object> inline CSS style for wrapper <li> element
}) {
  // formatting callback needed for AnimatedNumber
  const formatValue = useCallback((value) => `${value.toFixed(2)}%`, [])
  return (
    <li className={styles.Container} style={cardStyle}>
      {
        // viewport space limits the amount of characters a card name can hold.
        // For convenience, cut them at 35 and add a trailing "..." at the end
        getSlicedString(cardObj.name, 35, "...")
      }
      <AnimatedNumber
        value={drawChance}
        formatValue={formatValue}
        duration={200}
        className={styles.DrawPercentage}
      />
      <MiniCircleWithTransition
        triggerOn // always show it
        display={cardObj.quantity}
        animateOnDisplayChange // animate it when card quantity changes
        addNumberColorIndicator // match its color to its current quantity
        classNames={classes.miniCircle}
      />
    </li>
  )
}

CardListStatsItem.propTypes = {
  cardObj: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    quantity: PropTypes.number
  }).isRequired,
  drawChance: PropTypes.number.isRequired,
  cardStyle: PropTypes.shape({
    color: PropTypes.string
  }).isRequired
}
