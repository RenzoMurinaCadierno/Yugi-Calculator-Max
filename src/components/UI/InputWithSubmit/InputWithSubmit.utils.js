import styles from "./InputWithSubmit.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  input: (propsClassNames) => [styles.Input, propsClassNames?.join(" ")]
}
