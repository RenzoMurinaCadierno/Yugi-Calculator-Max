import styles from "./DeckMenu.module.css"

export const classes = {
  title: (propsClassNames) => [styles.Title, propsClassNames?.join(" ")],
  deckSelect: (propsClassNames) =>
    [styles.Select, propsClassNames?.join(" ")].join(" "),
  button: (propsClassNames) => [propsClassNames?.join(" ")]
}
