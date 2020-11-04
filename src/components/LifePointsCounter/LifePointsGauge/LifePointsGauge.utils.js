import styles from "./LifePointsGauge.module.css"

export const classes = {
  container: (isActive, containerClassNames) =>
    [
      styles.Container,
      isActive ? styles.ActiveContainer : "",
      containerClassNames?.join(" ")
    ].join(" "),
  playerTag: (isActive, classNames) => ({
    span: [
      styles.PlayerTag,
      isActive ? styles.ActiveTag : "",
      classNames.tag?.join(" ")
    ],
    form: [
      styles.PlayerTag,
      classNames.tag?.join(" "),
      classNames.form?.join(" ")
    ],
    input: [styles.PlayerTagInput, classNames.input?.join(" ")],
    charLimit: [styles.PlayerTag, classNames.charLimit?.join(" ")]
  }),
  progress: (isActive, progressClassNames) =>
    [
      styles.Progress,
      isActive ? styles.ActiveProgress : "",
      progressClassNames?.join(" ")
    ].join(" ")
}

export const inlineStyles = {
  affectedLP: (affectedLPColor) => ({ color: affectedLPColor }),
  progress: (animatedNumberValue, maxLP) => ({
    width: `${getLPProgressBarPercentage(animatedNumberValue, maxLP)}%`
  })
}

/**
 * Gets player's LP progressbar value using its reducer actual LP state and
 * the maximum set in LocalStorage object or in default configs
 * @param {number} currentLP current player's LP set in reducer
 * @param {number} maxLP Maximum LP set in playerConfigs LocalStorage object or default ui.configs.json
 */
export function getLPProgressBarPercentage(currentLP, maxLP) {
  if (maxLP <= currentLP) return 100
  return (currentLP / maxLP) * 100
}
