import styles from "./Toast.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  cross: (propsClassNames) =>
    [styles.Cross, propsClassNames?.join(" ")].join(" "),
  children: (propsClassNames) =>
    [styles.Children, propsClassNames?.join(" ")].join(" ")
}
