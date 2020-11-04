import styles from "./CalculatorLeftSide.module.css"

export const classes = {
  container: (isExpanded) =>
    [styles.Container, isExpanded ? "" : styles.Collapsed].join(" "),
  slider: (isExpanded) => ({
    container: [
      styles.SliderContainer,
      isExpanded ? "" : styles.SliderContainerCollapsed
    ],
    selector: [styles.SliderSelector],
    selectorOn: [styles.SliderSelectorOn],
    textOn: [styles.SliderTextOn],
    textOff: [styles.SliderTextOff]
  }),
  progressBar: (isExpanded) => ({
    container: [
      styles.ProgressBarContainer,
      isExpanded ? "" : styles.ProgressBarContainerCollapsed
    ],
    percentage: [styles.ProgressBarPercentage],
    timer: [styles.TimerCounter]
  })
}
