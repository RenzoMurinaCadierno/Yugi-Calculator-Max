import styles from "./DescPriceScreen.module.css"

export const classes = {
  screenDivision: (isMqXS, classNamesRefCurrent) => [
    !isMqXS ? styles.HalfScreen : "",
    classNamesRefCurrent
  ],
  arrow: (isMqXs, direction, isDescArrow) => ({
    container: [
      styles.ArrowIcon,
      isMqXs
        ? styles["ArrowPosition" + direction]
        : isDescArrow
        ? ""
        : styles.TopLeft
    ],
    image: [styles.ArrowImage]
  })
}

export const ariaLabels = {
  arrow: (isMqXs, showingState, isDescArrow) =>
    showingState === "both"
      ? `Enlarge ${isDescArrow ? "card details" : "sets and prices"} screen`
      : isMqXs
      ? `Show card ${isDescArrow ? "sets and prices" : "card details"} screen`
      : "Show both card details and sets-and-prices screen"
}
