import styles from "./OptionsTitle.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" ")
}
