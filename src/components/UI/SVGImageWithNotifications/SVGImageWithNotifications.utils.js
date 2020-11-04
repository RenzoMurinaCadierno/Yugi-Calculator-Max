import styles from "./SVGImageWithNotifications.module.css"

export const classes = {
  container: (propsClassNames, disabled, onClick) =>
    [
      styles.Container,
      onClick ? styles.Clickable : "",
      disabled ? styles.Disabled : "",
      propsClassNames?.join(" ")
    ].join(" "),
  image: (propsClassNames) =>
    [styles.Image, propsClassNames?.join(" ")].join(" "),
  text: (propsClassNames) =>
    [styles.Text, propsClassNames?.join(" ")].join(" "),
  miniCircle: (propsClassNames, miniCirclePosition) => [
    styles.MiniCircle,
    miniCirclePosition ? styles[miniCirclePosition] : "",
    propsClassNames?.join(" ")
  ]
}
