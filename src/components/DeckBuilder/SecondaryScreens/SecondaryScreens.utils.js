import React from "react"
import styles from "./SecondaryScreens.module.css"

export const classes = {
  toast: { children: [styles.ToastChildren] },
  screenDivision: [styles.ScreenDivison],
  deckSelectComponent: {
    title: [styles.DeckTitle],
    deckSelect: [styles.DeckSelect]
  },
  saveDeckComponent: {
    title: [styles.SaveTitle],
    miniCircle: [styles.SaveMiniCircle],
    disabledText: [styles.SaveDisabledText]
  },
  deleteDeckComponent: {
    title: [styles.DeleteTitle],
    miniCircle: [styles.DeleteMiniCircle],
    disabledText: [styles.DeleteDisabledText]
  },
  addDeckComponent: {
    title: [styles.AddTitle],
    miniCircle: [styles.AddMiniCircle],
    disabledText: [styles.AddDisabledText]
  }
}

export function handleActionBeforeDeleting(
  getSlicedString,
  setClickedDeckId,
  setCloseToastFlag,
  setToast,
  unfreezeApp,
  clickedDeckId,
  deckState,
  isDefaultDeck,
  toastTogglers
) {
  setClickedDeckId(0)
  if (deckState.deck_1 && !deckState.deck_2 && isDefaultDeck) {
    setToast("Cannot delete starting deck", null, toastTogglers.deleteDeck)
  } else {
    // trigger toast for confirmation. Set "deck_<id>" as url, which we will use
    // as a gateway for deleteAndGetLSObject()'s target deck key in Local Storage
    // and to update the reducer
    setToast(
      // the idea is to delete the deck with the user-clicked id. However, given
      // the instance they do not click on anything after deleting a deck, and
      // hit "delete" again, then always fallback to selectedDeckId, which is 1
      // after resetting. Character limit is set due to viewport width contstraints
      getSlicedString(
        deckState[`deck_${clickedDeckId ?? deckState.selectedDeckId}`].name,
        16,
        "..."
      ),
      // same as above, but to pass the deck key to the reducer
      `deck_${clickedDeckId ?? deckState.selectedDeckId}`,
      // and the long delay toggler
      toastTogglers.deleteDeck
    )
    setCloseToastFlag(true)
  }
  unfreezeApp()
}

export function getAdditionalToastJSX(toastState, onClick) {
  // null "url" here means we are displaying the "cannot delete default deck"
  // message. It is set as such in handleDeleteDeck() above. If we have a url,
  // it must contain the deck key as a string to delete from reducer and Local Storage
  if (toastState.type === "deleteDeck" && toastState.url) {
    return (
      <div className={styles.ToastText}>
        Sure to delete? &nbsp;&nbsp;
        <span onClick={onClick} className={styles.ToastClickable}>
          Yes, proceed.
        </span>
      </div>
    )
  } else if (toastState.type === "addDeck") {
    return (
      <div onClick={onClick} className={styles.ToastClickable}>
        Proceed anyway.
      </div>
    )
  } else if (toastState.type === "cardInfo" && toastState.url) {
    return (
      <div onClick={onClick} className={styles.ToastClickable}>
        {toastState.url.name}
      </div>
    )
  }
}
