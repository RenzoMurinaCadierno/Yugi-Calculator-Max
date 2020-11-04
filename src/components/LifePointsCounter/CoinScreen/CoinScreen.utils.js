export const classes = {
  plusMinusButton: (isMqPortrait) => [
    isMqPortrait ? "oneInRow" : "threeInRow",
    "height50",
    "letterSpacing"
  ],
  logButton: (isMqPortrait, logState) => [
    isMqPortrait ? "oneInRow" : "threeInRow",
    "height50",
    "letterSpacing",
    logState ? "" : "PrimaryText"
  ]
}
