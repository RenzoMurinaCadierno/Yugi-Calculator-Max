import styles from "./Slider.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  sliderBar: (propsClassNames) =>
    [styles.SlideBar, propsClassNames?.join(" ")].join(" "),
  selector: (switchState, propsSelectorClassNames, propsSelectorOnClassNames) =>
    [
      styles.SliderSwitchOff,
      propsSelectorClassNames?.join(" "),
      switchState
        ? `${styles.SliderSwitchOn} ${propsSelectorOnClassNames.join(" ")}`
        : ""
    ].join(" "),
  text: (switchState, propsTextOffClassNames, propsTextOnClasses) =>
    [
      styles.TextOff,
      propsTextOffClassNames?.join(" "),
      switchState ? `${styles.TextOn} ${propsTextOnClasses.join(" ")}` : ""
    ].join(" ")
}
