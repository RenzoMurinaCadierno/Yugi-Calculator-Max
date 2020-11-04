import styles from "./InputWithLabel.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  input: (propsClassNames) => [styles.Input, propsClassNames?.join(" ")],
  label: (isFocused, disabled, propsClassNames) =>
    [
      styles.Label,
      isFocused ? styles.LabelUp : "", // add LabelUp class if focused
      disabled ? styles.LabelDisabled : "", // and LabelDisabled if disabled
      propsClassNames?.join(" ")
    ].join(" "),
  helpText: (isFocused, propsClassNames) =>
    [
      styles.HelpText,
      isFocused ? styles.HelpTextActive : "", // same as LabelUp above
      propsClassNames?.join(" ")
    ].join(" ")
}

export function getText(textOnFocus, textOnBlur, isFocused) {
  return isFocused // on element focus:
    ? textOnFocus // if we assigned a particular text for focus
      ? textOnFocus // use it.
      : textOnBlur // Otherwise, use the default one.
    : textOnBlur // If the element is not focused, use the default text
}
