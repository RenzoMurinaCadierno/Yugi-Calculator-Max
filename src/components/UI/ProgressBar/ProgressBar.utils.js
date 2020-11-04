import styles from "./ProgressBar.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  progress: (propsClassNames) =>
    [styles.Progress, propsClassNames?.join(" ")].join(" "),
  percentage: (propsClassNames) =>
    [styles.Percentage, propsClassNames?.join(" ")].join(" "),
  timer: (propsClassNames) => [styles.Timer, propsClassNames?.join(" ")]
}

export const inlineStyles = {
  container: (currentPercentage, showProgress) => ({
    // progress width in %, and color rotation for extra effect
    width: showProgress ? `${100 - currentPercentage}%` : 0,
    filter: `hue-rotate(${-70 + currentPercentage}deg) opacity(35%)`
  })
}
