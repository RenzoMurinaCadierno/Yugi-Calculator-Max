import React from "react"
import SVGImage from "../../UI/SVGImage/SVGImage"
import heart from "../../../assets/uiIcons/heart.svg"
import clock from "../../../assets/uiIcons/clock.svg"
import die from "../../../assets/uiIcons/die.svg"
import coin from "../../../assets/uiIcons/coin.svg"
import styles from "./LogSwitches.module.css"

const classes = {
  lifepoints: (logState) => [
    styles.LifePointsSVG,
    logState ? styles.Active : ""
  ],
  dice: (logState) => [styles.DiceSVG, logState ? styles.Active : ""],
  coins: (logState) => [styles.CoinSVG, logState ? styles.CoinActive : ""],
  timer: (logState) => [styles.TimerSVG, logState ? styles.Active : ""]
}

export function getSVGImgJSX(
  type,
  logState,
  onClickCallback,
  logActionDispatcher,
  setLPSwitch
) {
  return (
    <SVGImage
      src={getSVGImgSrc(type)}
      alt={`${type} log ${logState ? "ON" : "OFF"}`}
      type={`${logState ? "primary" : "disabled"}`}
      role="button"
      ariaPressed={logState}
      classNames={classes[type](logState)}
      onClick={() =>
        onClickCallback(type.toUpperCase(), logActionDispatcher, setLPSwitch)
      }
    />
  )
}

function getSVGImgSrc(type) {
  switch (type) {
    case "lifepoints":
      return heart
    case "dice":
      return die
    case "coins":
      return coin
    case "timer":
      return clock
    default:
      return null
  }
}
