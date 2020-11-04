import styles from "./SelectionMenuScreen.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  menu: (propsClassNames) =>
    [styles.Menu, propsClassNames?.join(" ")].join(" "),
  menuItem: (title, currentOption, propsClassNames) =>
    [
      styles.MenuItem,
      title === currentOption ? styles.Active : "",
      propsClassNames?.join(" ")
    ].join(" "),
  content: (propsClassNames) =>
    [styles.Content, propsClassNames?.join(" ")].join(" "),
  contentItem: (propsClassNames) =>
    [styles.ContentItem, propsClassNames?.join(" ")].join(" ")
}

export const inlineStyles = {
  menuItem: (titlesArray) => ({ width: `calc(100% / ${titlesArray.length})` })
}
