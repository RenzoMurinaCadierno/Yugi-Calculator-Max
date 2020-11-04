import React from "react"
import SVGImage from "../../UI/SVGImage/SVGImage"
import heart from "../../../assets/uiIcons/heart.svg"
import die from "../../../assets/uiIcons/die.svg"
import coin from "../../../assets/uiIcons/coin.svg"
import clock from "../../../assets/uiIcons/clock.svg"
import styles from "./LogMenu.module.css"

export const classes = {
  allLogs: (activeIcon) =>
    [
      styles.LogIconAll,
      activeIcon === "all" ? styles.LogIconAllActive : ""
    ].join(" "),
  lp: (activeIcon) => [
    styles.LogMenuIcon,
    activeIcon === "lp" ? styles.LogMenuIconActive : ""
  ],
  dice: (activeIcon) => [
    styles.LogMenuIcon,
    styles.LogIconDie,
    activeIcon === "dice" ? styles.LogMenuIconActive : ""
  ],
  coin: (activeIcon) => [
    styles.LogMenuIcon,
    styles.Bright0,
    activeIcon === "coin" ? styles.LogMenuIconActive : ""
  ],
  timer: (activeIcon) => [
    styles.LogMenuIcon,
    styles.LogIconClock,
    activeIcon === "timer" ? styles.LogMenuIconActive : ""
  ],
  trash: [styles.LogMenuIcon, styles.LogIconTrash]
}

export function getLogFilterSVGImg(type, activeIcon, onClickCallback) {
  return (
    <SVGImage
      src={getSVGImgSrc(type)}
      alt={`Filter by ${type}`}
      type="secondary"
      role="button"
      ariaPressed={activeIcon === type}
      classNames={classes[type](activeIcon)}
      onClick={onClickCallback}
      dataId={type}
    />
  )
}

function getSVGImgSrc(type) {
  switch (type) {
    case "lp":
      return heart
    case "dice":
      return die
    case "coin":
      return coin
    case "timer":
      return clock
    default:
      return null
  }
}
