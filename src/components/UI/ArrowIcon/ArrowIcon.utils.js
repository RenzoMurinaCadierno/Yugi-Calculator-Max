import styles from "./ArrowIcon.module.css"

export const classes = {
  container: (disabled, onClick, isActive, propsClassNames) =>
    [
      styles.Container,
      disabled ? styles.ContainerDisabled : "",
      onClick ? styles.Clickable : "",
      isActive ? styles.Active : "",
      propsClassNames?.join(" ")
    ].join(" "),
  image: (disabled, direction, propsClassNames) =>
    [
      styles.ArrowImage,
      styles[direction], // dynamically added orientation styles
      disabled ? styles.ArrowImageDisabled : "",
      propsClassNames?.join(" ")
    ].join(" "),
  extraText: (disabled, propsClassNames) =>
    [
      styles.ExtraText,
      disabled ? styles.ArrowImageDisabled : "",
      propsClassNames?.join(" ")
    ].join(" ")
}
