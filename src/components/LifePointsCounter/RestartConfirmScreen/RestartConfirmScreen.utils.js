import styles from "./RestartConfirmScreen.module.css"

export const classes = {
  restartConfirm: [styles.Message, styles.ConfirmMsg].join(" "),
  button: (isMqPortrait) => [
    isMqPortrait ? "oneInRow" : "twoInRow",
    "letterSpacing",
    "flex-center"
  ]
}
