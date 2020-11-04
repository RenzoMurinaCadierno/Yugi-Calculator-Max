import styles from "./SVGImage.module.css"

export const classes = {
  container: (type, propsClassNames) =>
    [
      (styles.Default,
      type
        ? styles[`${type[0].toUpperCase() + type.slice(1).toLowerCase()}`]
        : ""),
      propsClassNames?.join(" ")
    ].join(" ")
}
