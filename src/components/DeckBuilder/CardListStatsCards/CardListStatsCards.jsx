import React from "react"
import PropTypes from "prop-types"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import CardListStatsItem from "../CardListStatsItem/CardListStatsItem"
import { getCardTypeStyle } from "../../../utils/yugiohSpecificFunctions"
import styles from "./CardListStatsCards.module.css"

export default function CardListStatsCards({
  remainingCards, // <Array> remaining card objects in DeckBuilder reducer's "fallbackTestDeck"
  cardTotal // <number> quantity of cards left in DeckBuilder reducer's "fallbackTestDeck"
}) {
  return (
    // manage <li> transitioning (classNames in .module.css file)
    <TransitionGroup component="ul" className={styles.Container}>
      {remainingCards.map((cardObj) => {
        // depending on the card's type, get its associated color
        const cardStyle = { color: getCardTypeStyle(cardObj.type) }
        // calculate its draw chance based on its quantity and total remaining
        // cards in "test" deck. Set it to 0 if cardTotal is 0, as if we do not
        // do this, a division by 0 will crash the program
        const drawChance =
          cardTotal === 0 ? 0 : (cardObj.quantity / cardTotal) * 100
        // render <CardListStatsItem />
        return (
          <CSSTransition
            component={null}
            key={cardObj.name}
            timeout={250}
            classNames="card-list-item-slide"
            mountOnEnter
            unmountOnExit
          >
            <CardListStatsItem
              cardObj={cardObj}
              drawChance={drawChance}
              cardStyle={cardStyle}
            />
          </CSSTransition>
        )
      })}
    </TransitionGroup>
  )
}

CardListStatsCards.propTypes = {
  remainingCards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      quantity: PropTypes.number
    })
  ).isRequired,
  cardTotal: PropTypes.number.isRequired
}
