import styles from "./LifePoints.module.css"

export const classes = {
  container: (isExpanded) =>
    [styles.Container, isExpanded ? styles.ContainerExpanded : ""].join(" "),
  p1LPGauge: (isExpanded) => ({
    container: [
      styles.LPContainer,
      isExpanded ? styles.LPContainerExpanded : ""
    ],
    tag: [styles.PlayerOneTag],
    input: [styles.PlayerOneTagInput],
    form: [styles.PlayerOneTagForm],
    charLimit: [styles.PlayerOneCharLimit]
  }),
  p2LPGauge: (isExpanded) => ({
    container: [
      styles.LPContainer,
      isExpanded ? styles.LPContainerExpanded : ""
    ],
    tag: [styles.PlayerTwoTag],
    input: [styles.PlayerTwoTagInput],
    form: [styles.PlayerTwoTagForm],
    charLimit: [styles.PlayerTwoCharLimit]
  })
}
