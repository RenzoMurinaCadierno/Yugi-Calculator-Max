import styles from "./CalculatorRightSide.module.css"

export const classes = {
  container: (isExpanded) =>
    [styles.Container, isExpanded ? "" : styles.Collapsed].join(" "),
  coin: (isExpanded) => [styles.Coin, isExpanded ? "" : styles.CoinCollapsed],
  die: (isExpanded) => [styles.Die, isExpanded ? "" : styles.DieCollapsed],
  token: (isExpanded) => [styles.Token, isExpanded ? "" : styles.TokenCollapsed]
}
