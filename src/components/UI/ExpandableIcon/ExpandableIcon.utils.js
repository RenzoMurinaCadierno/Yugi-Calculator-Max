import styles from "./ExpandableIcon.module.css"

export const classes = {
  container: (
    showDetails,
    propsContainerClasses,
    propsExpandContainerClasses
  ) =>
    [
      styles.Container,
      showDetails ? styles.ExpandContainer : "",
      propsContainerClasses?.join(" "),
      showDetails ? propsExpandContainerClasses?.join(" ") : ""
    ].join(" "),
  content: (showDetails, propsClassNames) =>
    [
      styles.Content,
      showDetails ? styles.ExpandContent : "",
      propsClassNames?.join(" ")
    ].join(" "),
  icon: (showDetails, propsClassNames) =>
    [
      styles.Icon,
      showDetails ? styles.ExpandIcon : "",
      propsClassNames?.join(" ")
    ].join(" ")
}
