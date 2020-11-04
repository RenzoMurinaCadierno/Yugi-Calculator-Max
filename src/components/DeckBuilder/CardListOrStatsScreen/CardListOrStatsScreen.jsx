import React, { useContext } from "react"
import { DeckBuilderContext } from "../../../contexts/DeckBuilderContext"
import CardListScreen from "../CardListScreen/CardListScreen"
import CardListStatsScreen from "../CardListStatsScreen/CardListStatsScreen"

export default function CardListOrStatsScreen() {
  // grab everything needed of DeckBuilderContext to pass to components below
  const {
    cardListState,
    cardCache,
    deckState,
    dispatchDeckAction,
    setCardCache,
    fetchCardList,
    triggerCardDetailsToast
  } = useContext(DeckBuilderContext)
  // if we are sitting in "Test" section of <SelectionMenuScreen />, render
  // <CardListStatsScreen /> (which shows each card in "main" section and their
  // chance to be drawn), otherwise bring <CardListScreen /> (the list of fetched
  // cards to construct the deck)
  return deckState.selectedDeckSection === "test" ? (
    <CardListStatsScreen deckState={deckState} />
  ) : (
    <CardListScreen
      cardListState={cardListState}
      cardCache={cardCache}
      dispatchDeckAction={dispatchDeckAction}
      fetchCardList={fetchCardList}
      setCardCache={setCardCache}
      triggerCardDetailsToast={triggerCardDetailsToast}
    />
  )
}
