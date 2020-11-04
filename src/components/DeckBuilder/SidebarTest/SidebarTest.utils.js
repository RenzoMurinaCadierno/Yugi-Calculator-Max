import card from "../../../assets/uiIcons/card.svg"
import shuffle from "../../../assets/uiIcons/shuffle.svg"
import reload from "../../../assets/uiIcons/reload.svg"

export function getSvg(type) {
  if (type === "shuffle") return shuffle
  if (type === "reset") return reload
  return card
}

export function getSvgImagesKeyValArr(
  deckState,
  handleDrawCard,
  handleShuffleOrReset
) {
  return Object.entries({
    draw_1: {
      amount: 1,
      onClick: handleDrawCard,
      disabled: !deckState.fallbackTestDeck.length
    },
    draw_5: {
      amount:
        deckState.fallbackTestDeck.length >= 5
          ? 5
          : deckState.fallbackTestDeck.length,
      onClick: handleDrawCard,
      disabled: !deckState.fallbackTestDeck.length
    },
    shuffle: {
      amount: null,
      onClick: () => handleShuffleOrReset(true),
      disabled: !deckState[`deck_${deckState.selectedDeckId}`].main.length
    },
    reset: {
      amount: null,
      onClick: () => handleShuffleOrReset(false),
      disabled: !deckState[`deck_${deckState.selectedDeckId}`].test.length
    }
  })
}
