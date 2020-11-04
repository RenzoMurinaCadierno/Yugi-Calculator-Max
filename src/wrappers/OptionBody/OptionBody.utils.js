import styles from "./OptionBody.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" ")
}
