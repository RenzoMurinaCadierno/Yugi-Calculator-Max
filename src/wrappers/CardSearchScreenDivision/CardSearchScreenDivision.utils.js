import styles from "./CardSearchScreenDivision.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" ")
}
