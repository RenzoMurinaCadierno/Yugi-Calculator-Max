export const classes = {
  plusMinusButton: (isMqPortrait) => [
    isMqPortrait ? "oneInRow" : "threeInRow",
    "height50",
    "letterSpacing"
  ],
  removeSelected: (isMqPortrait) => [
    isMqPortrait ? "oneInRow" : "threeInRow",
    "height50"
  ]
}

export const ariaLabels = {
  minusButton: (tokenStateItemsLength) =>
    tokenStateItemsLength ? "Remove one token" : "No tokens to remove",
  removeButton: "Remove selected token",
  plusButton: (tokenStateItemsLength) =>
    tokenStateItemsLength >= 6 ? "Cannot add more tokens" : "Add one token"
}
