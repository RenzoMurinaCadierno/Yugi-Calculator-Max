import styles from "./Input.module.css"

export const classes = {
  container: (disabled, propsClassNames) =>
    [
      styles.Container,
      disabled ? styles.Disabled : "",
      propsClassNames?.join(" ")
    ].join(" ")
}
