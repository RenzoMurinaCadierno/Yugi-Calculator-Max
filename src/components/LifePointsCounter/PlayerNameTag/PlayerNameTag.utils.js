import styles from "./PlayerNameTag.module.css"

export const classes = {
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
  editableSpan: (nameLength) => ({
    filter: `hue-rotate(${-50 + (nameLength * 100) / 24}deg) brightness(${
      175 - nameLength * 6
    }%)`
  })
}
