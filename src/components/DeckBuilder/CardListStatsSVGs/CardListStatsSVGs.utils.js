import React from "react"
import AnimatedNumber from "animated-number-react"
import SVGImageWithNotifications from "../../UI/SVGImageWithNotifications/SVGImageWithNotifications"
import card from "../../../assets/uiIcons/card.svg"
import styles from "./CardListStatsSVGs.module.css"

const classes = {
  monster: getClasses("Monster"),
  spell: getClasses("Spell"),
  trap: getClasses("Trap")
}

function getClasses(cardType) {
  return {
    container: [styles.SVGImageContainer, styles[`SVGImgContainer${cardType}`]],
    image: [styles[cardType]],
    text: [styles.SVGImageText]
  }
}

export function getSVGImageWithNotificationsJSX(
  typeStatsObject,
  cardType,
  formatValueCallback
) {
  return (
    <SVGImageWithNotifications
      src={card}
      alt={`${cardType} cards`}
      text={
        <>
          {typeStatsObject.qty} <br />
          <AnimatedNumber
            value={typeStatsObject.chance}
            formatValue={formatValueCallback}
            duration={200}
          />
          %
        </>
      }
      disabled={typeStatsObject.qty === 0}
      classNames={classes[cardType]}
    />
  )
}
