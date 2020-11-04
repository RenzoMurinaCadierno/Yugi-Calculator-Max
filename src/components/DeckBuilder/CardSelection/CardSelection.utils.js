import React from "react"
import Spinner from "../../UI/Spinner/Spinner"
import Button from "../../UI/Button/Button"
import styles from "./CardSelection.module.css"

export const classes = {
  refetchButton: ["width85", "letterSpacing015", "bold", "italic"],
  miniCircle: [styles.ItemModifier],
  miniCircleMinus: [styles.ItemModifier, styles.ItemModifierMinus],
  spinner: {
    container: [styles.SpinnerContainer]
  }
}

export const jsx = {
  loadingJSX: (
    <div className={styles.TextContainer}>
      <span className={styles.LoadingTextTitle}>
        Loading card list, it may take some time
      </span>
      <span className={styles.LoadingTextSubtitle}>
        (there are 10.000+ cards!)
      </span>
      <Spinner classNames={classes.spinner} />
    </div>
  ),
  errorJSX: (refetchCardList) => (
    <div className={styles.TextContainer}>
      <span className={styles.ErrorTitle}>Error while retrieving cards</span>
      <span className={styles.ErrorSubtitle}>
        Check that you are connected to internet and try refetching with the
        button below.
      </span>
      <span className={styles.ErrorSubtitle}>
        If the button is disabled, check "Danger Zone" in "Configs" page.
      </span>
      <Button
        type="secondary"
        disabled={!navigator.onLine}
        sutileAnimation
        onClick={refetchCardList}
        classNames={classes.refetchButton}
      >
        {navigator.onLine
          ? "Try refetching cards"
          : "Cannot fetch cards. Not connected to internet"}
      </Button>
    </div>
  ),
  cardsLoadedJSX: (
    <div className={styles.TextContainer}>
      <span className={styles.SuccessTitle}>Cards loaded!</span>
      <span className={styles.SuccessSubtitle}>
        Type 3 or more subsequent characters of the card's name in "Filter list"
        to show results.
      </span>
      <span className={styles.SuccessSubtitle}>
        Click on the card and then on "+1" to add it to the deck.
      </span>
      <span className={styles.SuccessSubtitle}>
        Check "Help" for more information.
      </span>
    </div>
  ),
  noMatchJSX: (
    <div className={styles.TextContainer}>
      <span className={styles.SuccessTitle}>Loading/Failure</span>
      <span className={styles.SuccessSubtitle}>
        If this message does not go away in one second, then there are no
        results for what you searched.
      </span>
      <span className={styles.SuccessSubtitle}>
        Make sure to type the name or part of the name correctly, and remember
        to use special symbols if needed (like &, -, /).
      </span>
    </div>
  )
}
