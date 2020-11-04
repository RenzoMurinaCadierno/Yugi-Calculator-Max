import styles from "./DeckBuilderBottomScreen.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" ")
}
