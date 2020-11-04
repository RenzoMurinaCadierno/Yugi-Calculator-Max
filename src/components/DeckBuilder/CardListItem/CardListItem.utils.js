import styles from "./CardListItem.module.css"

export const classes = {
  container: (propsClasses) =>
    [styles.Container, propsClasses?.join(" ")].join(" "),
  miniCircle: (propsClasses) => [styles.MiniCircle, propsClasses?.join(" ")],
  deleteMiniCircle: (propsClasses) => [
    styles.DeleteMiniCircle,
    propsClasses?.join(" ")
  ],
  arrowMiniCircle: (propsClasses) => [
    styles.ArrowMiniCircle,
    propsClasses?.join(" ")
  ],
  infoMiniCircle: (propsClasses) => [
    styles.InfoMiniCircle,
    propsClasses?.join(" ")
  ]
}
