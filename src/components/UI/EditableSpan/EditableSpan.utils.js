import styles from "./EditableSpan.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  span: (propsClassNames) =>
    [styles.Span, propsClassNames?.join(" ")].join(" "),
  inputWithSubmit: (propsContainerClassNames, propsInputClassNames) => ({
    container: [styles.Form, propsContainerClassNames?.join(" ")],
    input: [styles.Input, propsInputClassNames?.join(" ")]
  }),
  charLimit: (propsClassNames) =>
    [styles.CharLimit, propsClassNames?.join(" ")].join(" ")
}

export const inlineStyles = {
  charLimit: (displayCharLength, maxCharLength) => ({
    filter: `hue-rotate(${
      -50 + (displayCharLength * 100) / (maxCharLength * 2)
    }deg) 
    brightness(150%)
    `
  })
}
