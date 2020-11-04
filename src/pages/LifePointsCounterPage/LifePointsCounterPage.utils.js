import uiConfigs from "../../utils/ui.configs.json"
import styles from "./LifePointsCounterPage.module.css"

export const classes = {
  miniCircle: (showCalcButtons) => [
    styles.CalculatorMiniCircle,
    showCalcButtons ? styles.CalculatorMiniCircleActive : ""
  ]
}

export function swipeHandlers(toggleCalcButtons) {
  return {
    onSwipedUp: toggleCalcButtons,
    onSwipedDown: toggleCalcButtons,
    delta: uiConfigs.swipeDelta
  }
}
