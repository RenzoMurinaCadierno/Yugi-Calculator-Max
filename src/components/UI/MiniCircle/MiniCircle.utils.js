import styles from "./MiniCircle.module.css"

export const classes = {
  container: (
    isActive,
    onClick,
    animateOnClick,
    animateOnDisplayChange,
    growState,
    propsClassNames
  ) =>
    [
      styles.Container, // default className
      isActive ? styles.ContainerActive : "",
      onClick ? styles.Clickable : "",
      (animateOnClick || animateOnDisplayChange) && growState
        ? styles.Grow
        : "",
      propsClassNames?.join(" ")
    ].join(" ")
}

export const inlineStyles = {
  container: (display, style, addNumberColorIndicator) =>
    // addNumberColorIndicator is true only on <DeckBuilder>'s <CardListItem> components.
    // It tells <MiniCircle> to change hue and brightness according to the number shown.
    // If addNumberColorIndicator is undefined, then apply "styles" object in props.
    // undefined "styles" prop results in null inline styles
    addNumberColorIndicator
      ? {
          filter: `hue-rotate(${
            50 + (((display * 100) / 5) ^ -1)
          }deg) brightness(${80 + display * 25}%)      `
        }
      : style ?? null
}
