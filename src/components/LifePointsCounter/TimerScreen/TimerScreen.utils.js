import styles from "./TimerScreen.module.css"

export const classes = {
  inputWithSubmit: {
    container: [styles.InputForm],
    input: [styles.Input]
  },
  actionButton: (isMqPortrait) => [
    isMqPortrait ? "oneInRow" : "fourInRow",
    "height50",
    "letterSpacing"
  ],
  logButton: (isMqPortrait, logState) => [
    isMqPortrait ? "oneInRow" : "fourInRow",
    "height50",
    "letterSpacing",
    logState ? "" : "PrimaryText"
  ]
}

export const ariaLabels = {
  startTimer: (isTimerRunning) =>
    isTimerRunning
      ? "Timer has already started. Stop it to restart"
      : "Start timer",
  freezeTimer: (isTimerRunning, isTimerFrozen) =>
    isTimerRunning
      ? isTimerFrozen
        ? "Unpause timer"
        : "Pause timer"
      : "Timer is not running, you cannot pause it",
  stopTimer: (isTimerRunning) =>
    isTimerRunning ? "Stop Timer" : "Timer is stopped",
  logTimer: (logState) =>
    `Click to log timer. Current state: ${logState ? "ON" : "OFF"}`
}
