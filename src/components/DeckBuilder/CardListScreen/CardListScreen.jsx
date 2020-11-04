import React, { useState, memo, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import usePreviousState from "../../../hooks/usePreviousState"
import * as deckConstructorActionCreators from "../../../store/DeckConstructor/deckConstructorActionCreators"
import DeckBuilderTopScreen from "../../../wrappers/DeckBuilderTopScreen/DeckBuilderTopScreen"
import DeckBuilderBottomScreen from "../../../wrappers/DeckBuilderBottomScreen/DeckBuilderBottomScreen"
import CardSelection from "../CardSelection/CardSelection"
import CardFilter from "../CardFilter/CardFilter"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./CardListScreen.utils"

function CardListScreen({
  cardListState, // <object> useFetch()'s returned object called upon YGOPRODeck's database
  cardCache, // <DeckConstructor's card cache (=== resolved cards fetched data)
  dispatchDeckAction, // <function> DeckConstructor's reducer action dispatcher
  fetchCardList, // <function> useFetch()'s function to hit the database again
  setCardCache, // <function> cardCache's setter
  triggerCardDetailsToast // <function> Toast dispatcher across-pages
}) {
  // "cards" state array is the one to be rendered in <CardSelection />, and will
  // constantly mutate its values by filtering card cache
  const [cards, setCards] = useState([])
  // "value" is assigned by filter card's input in <CardFilter />, and is used to
  // filter cache and set state of "cards"
  const [value, setValue] = useState("")
  // keep a copy of the previous typed value to check if we need to apply filtering
  const previousValue = usePreviousState(value)

  const handleCardClick = useCallback(
    // handler to assign to "+1" MiniCircle in <CardSelection />. It adds a
    // valid card object to the currently loaded deck
    (cardObj) => {
      dispatchDeckAction(deckConstructorActionCreators.addCard(cardObj, true))
    },
    [dispatchDeckAction]
  )

  useEffect(() => {
    // each time value changes in <CardFilter />'s input, set a timeout of some
    // ms as not to trigger this effect constantly. Filtering a list of 10.000+
    // cards is expensive enough as to limit useEffect calls this way
    const filterTimeout = setTimeout(() => {
      // if we typed less than 3 characters in the filter, set cards state to
      // and empty array, effectively rendering nothing (this way, the resulting
      // filtered array will be short enough as not to overload the app with data)
      if (value.length < 3) setCards([])
      // on 3+ typed characters, apply filtering
      else {
        setCards(() => {
          // if we typed one more character than the previous value and "cards",
          // array still holds objects in it, filter it again without touching
          // cardCache, as the result we are looking for is still inside "cards"
          if (previousValue.length < value.length && cards.length !== 0) {
            return cards.filter((card) =>
              card.name.toLowerCase().includes(value.toLowerCase())
            )
          }
          // otherwise, "cards" array is empty, it does not hold a card with a name
          // equal to what we are trying to filter, or instead of typing a new
          // character, we cleared one (backspace). All cases need a new filter on
          // cardCache to re-set "cards" array.
          return cardCache.filter((card) =>
            card.name.toLowerCase().includes(value.toLowerCase())
          )
        })
      }
    }, uiConfigs.apiConfigs.filterTimeout)
    // on cleanup, clear timeout
    return () => clearTimeout(filterTimeout)
  }, [value])

  return (
    <>
      {/* Screen division where loaded cards or card fetch states are displayed */}
      <DeckBuilderTopScreen
        ariaLabel="List of all cards in the game. Click on the buttons on each to add or remove them"
        classNames={classes.screenDivisionTop}
      >
        <CardSelection
          value={value}
          cards={cards}
          cache={cardCache}
          isLoading={cardListState.isLoading}
          hasError={cardListState.hasError}
          handleCardClick={handleCardClick}
          fetchCardList={fetchCardList}
          setCardCache={setCardCache}
          triggerCardDetailsToast={triggerCardDetailsToast}
        />
      </DeckBuilderTopScreen>
      {/* Screen division where filtering input is displayed */}
      <DeckBuilderBottomScreen
        ariaLabel="Filter section. Type on the input below to filter the card list"
        classNames={classes.screenDivisionBottom}
      >
        <CardFilter
          value={value}
          setValue={setValue}
          disabled={cardListState.isLoading || !cardCache.length}
        />
      </DeckBuilderBottomScreen>
    </>
  )
}

CardListScreen.propTypes = {
  cardListState: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string
      })
    ),
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool
  }),
  cardCache: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string
    })
  ),
  dispatchDeckAction: PropTypes.func.isRequired,
  fetchCardList: PropTypes.func.isRequired,
  triggerCardDetailsToast: PropTypes.func.isRequired
}

export default memo(CardListScreen)
