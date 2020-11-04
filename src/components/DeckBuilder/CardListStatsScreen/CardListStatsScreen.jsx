import React, { memo } from "react"
import PropTypes from "prop-types"
import DeckBuilderTopScreen from "../../../wrappers/DeckBuilderTopScreen/DeckBuilderTopScreen"
import DeckBuilderBottomScreen from "../../../wrappers/DeckBuilderBottomScreen/DeckBuilderBottomScreen"
import CardListStatsSVGs from "../CardListStatsSVGs/CardListStatsSVGs"
import CardListStatsCards from "../CardListStatsCards/CardListStatsCards"
import { classes, getTestDeckStats } from "./CardListStatsScreen.utils"

function CardListStatsScreen({
  deckState // <object> DeckConstructor's reducer "deckState" object
}) {
  // fallbackTestDeck in deckState's reducer object is always updated to what "main"
  // section of the current deck holds.
  // If this component renders, it means we are in "Test" section, so construct a valid
  // object containing the remaining cards in the "main" section (not yet drawn), the
  // "total" amount of cards in "main" section, and "monster", "spell" and "trap" objects,
  // each of them with their remaining card quantity and chance to be drawn
  const testDeckStats = getTestDeckStats(deckState.fallbackTestDeck)

  return (
    <>
      <DeckBuilderTopScreen
        ariaLabel="Deck stats for Testing purposes"
        classNames={classes.screenDivisionTop}
      >
        {/* SVGs for "monster", "spell" and "trap" cards and their draw % ratios */}
        <CardListStatsSVGs testDeckStats={testDeckStats} />
        {/* list of card items with their remaining quantities and draw % ratios */}
        <CardListStatsCards
          remainingCards={testDeckStats.remainingCards}
          cardTotal={testDeckStats.total}
        />
      </DeckBuilderTopScreen>
      {/* fillter section to match styles in <DeckCreatorScreen />'s view */}
      <DeckBuilderBottomScreen
        ariaLabel="Filler section"
        classNames={classes.screenDivisionBottom}
        children="" // no children. Filler section
      />
    </>
  )
}

CardListStatsScreen.propTypes = {
  deckState: PropTypes.object.isRequired
}

export default memo(CardListStatsScreen)
