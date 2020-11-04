import styles from "./SFXSwitch.module.css"

export const classes = {
  text: (playSFXs) =>
    [styles.ToastText, playSFXs ? "" : styles.ToastTextInactive].join(" "),
  svgImage: (playSFXs) => [styles.SfxSVG, playSFXs ? styles.Active : ""]
}
