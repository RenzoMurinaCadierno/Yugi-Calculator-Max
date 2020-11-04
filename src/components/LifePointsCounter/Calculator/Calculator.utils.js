import styles from "./Calculator.module.css"

export const classes = {
  container: (showCalcButtons) =>
    [styles.Container, showCalcButtons ? "" : styles.Collapsed].join(" ")
}

/**
 * Calculator buttons configs. It holds an array with each individual button
 * objects. They consist of:
 * > label: what's diplayed in button's UI.
 * > type: the action type to fire off LifePoints reducer
 * > ariaLabel: if the type is unclear for screen readers, then ariaLabel applies
 */
export const calcButtons = {
  buttonsArray: [
    {
      label: "C",
      type: "CLEAR",
      ariaLabel: "Clear operation"
    },
    {
      label: "1",
      type: "MODIFY"
    },
    {
      label: "2",
      type: "MODIFY"
    },
    {
      label: "3",
      type: "MODIFY"
    },
    {
      label: "-100",
      type: "DEC",
      ariaLabel: "Decrease 100 Life Points"
    },
    {
      label: "R",
      type: "CONFIRM_RESTART",
      ariaLabel: "Start a new duel"
    },
    {
      label: "4",
      type: "MODIFY"
    },
    {
      label: "5",
      type: "MODIFY"
    },
    {
      label: "6",
      type: "MODIFY"
    },
    {
      label: "-500",
      type: "DEC",
      ariaLabel: "Decrease 500 Life Points"
    },
    {
      label: "1/2",
      type: "DEC",
      ariaLabel: "Halve life points"
    },
    {
      label: "7",
      type: "MODIFY"
    },
    {
      label: "8",
      type: "MODIFY"
    },
    {
      label: "9",
      type: "MODIFY"
    },
    {
      label: "-1000",
      type: "DEC",
      ariaLabel: "Decrease 1000 Life Points"
    },
    {
      label: "+",
      type: "INC",
      ariaLabel: "Increase life points"
    },
    {
      label: "0",
      type: "MODIFY"
    },
    {
      label: "00",
      type: "MODIFY"
    },
    {
      label: "000",
      type: "MODIFY"
    },
    {
      label: "-",
      type: "DEC",
      ariaLabel: "Decrease life points"
    }
  ]
}
