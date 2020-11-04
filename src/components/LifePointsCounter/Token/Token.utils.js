import styles from "./Token.module.css"

export const classes = {
  arrowImageClasses: (isActive) => [
    styles.ArrowImage,
    isActive ? styles.ArrowImageActive : ""
  ],
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  image: (isActive, propsClassNames) =>
    [
      styles.Image,
      isActive ? styles.ImageActive : "",
      propsClassNames?.join(" ")
    ].join(" "),
  arrowClasses: (isActive, direction, propsClassNames) => ({
    container: [
      styles.Arrow,
      styles["Arrow" + direction],
      propsClassNames?.join(" ")
    ],
    arrow: classes.arrowImageClasses(isActive)
  })
}
