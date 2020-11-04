import React, { useState, useCallback } from "react"
// import PropTypes from "prop-types"
import AnimatedNumber from "animated-number-react"
import SVGImageWithNotifications from "../../UI/SVGImageWithNotifications/SVGImageWithNotifications"
import MiniCircle from "../../UI/MiniCircle/MiniCircle"
import cardImg from "../../../assets/uiIcons/card.svg"
import { classes } from "./HelpDemoDrawCards.utils"
import styles from "./HelpDemoDrawCards.module.css"

export default function HelpDemoDrawCards() {
  // state and setter for each type of cards and their quantities
  const [cardQty, setCardQty] = useState({ monster: 0, spell: 0, trap: 0 })
  // store the sum of all card quantities in a separate variable
  const cardTotal = Object.values(cardQty).reduce(
    (acc, currQty) => acc + currQty,
    0
  )

  const handleSVGClick = useCallback(
    (e) => {
      // SVG component's data-id stores the card type ("monster", "spell", "trap")
      const stateKey = e.target.dataset.id
      setCardQty((prevQty) => ({
        // sum 1 to the previous card quantity on the respective key.
        // if it exceeds 5, roll back to 0
        ...prevQty,
        [stateKey]: prevQty[stateKey] >= 5 ? 0 : prevQty[stateKey] + 1
      }))
    },
    [setCardQty]
  )

  const handleTotalMiniCircleClick = useCallback(() => {
    // on "cardTotal" MiniCircle Click, if the sum of all card quantities is
    // not 0, set everything back to 0.
    cardTotal && setCardQty({ monster: 0, spell: 0, trap: 0 })
  }, [cardTotal, setCardQty])

  // AnimatedNumber's required format callback
  const formatValue = useCallback((value) => value.toFixed(2), [])

  const getSVGImageWithNotificationsJSXForType = useCallback(
    // JSX getter function for <SVGImageWithNotifications /> of each card type
    (type) => (
      <SVGImageWithNotifications
        key={type}
        dataId={type}
        src={cardImg}
        alt={`${type} quantity`}
        text={
          <>
            <AnimatedNumber
              value={
                // show percentage of card type quantity over card total
                cardQty[type] === 0 ? 0 : (cardQty[type] / cardTotal) * 100
              }
              formatValue={formatValue}
              duration={200}
            />
            %
          </>
        }
        miniCircleDisplay={cardQty[type].toString()}
        miniCircleTrigger // same as triggerOn={true} for <MiniCircle />
        miniCirclePosition="top-right"
        animateOnDisplayChange
        onClick={handleSVGClick}
        classNames={classes[type]}
      />
    ),
    [cardQty, cardTotal]
  )

  return (
    <div className={styles.Container}>
      {/* SVGImageWithNotifications for each type of card */}
      {getSVGImageWithNotificationsJSXForType("monster")}
      {getSVGImageWithNotificationsJSXForType("spell")}
      {getSVGImageWithNotificationsJSXForType("trap")}
      {/* a <MiniCircle /> for the total amount of cards */}
      <MiniCircle
        display={cardTotal}
        animateOnClick
        onClick={handleTotalMiniCircleClick}
        classNames={classes.total}
      />
    </div>
  )
}
