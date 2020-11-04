import styles from "./Spinner.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Chase, propsClassNames?.join(" ")].join(" "),
  dots: (propsClassNames) =>
    [styles.ChaseDot, propsClassNames?.join(" ")].join(" ")
}
