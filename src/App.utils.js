import React from "react"
import ArrowIcon from "./components/UI/ArrowIcon/ArrowIcon"
import Arrow from "./assets/uiIcons/arrowPage.svg"
import styles from "./App.module.css"

export const classes = {
  arrowLeft: {
    container: [styles.ArrowContainer],
    arrow: [styles.ArrowImage],
    text: [styles.ArrowText]
  },
  arrowRight: {
    container: [styles.ArrowContainer, styles.ArrowContainerLeft],
    arrow: [styles.ArrowImage],
    text: [styles.ArrowText, styles.ArrowTextLeft]
  },
  spinner: {
    container: [styles.SpinnerContainer]
  }
}

export function getNavigationArrowJSX(
  direction,
  destination,
  screenIsFrozen,
  onClick
) {
  return (
    <ArrowIcon
      component="nav"
      pointing={direction}
      arrowImage={Arrow}
      extraText={destination}
      alt={`Go to ${destination}`}
      role="navigation"
      isClickable
      disabled={screenIsFrozen}
      onClick={onClick}
      dataId={direction}
      classNames={
        classes[
          `arrow${
            direction[0].toUpperCase() + direction.slice(1).toLowerCase()
          }`
        ]
      }
    />
  )
}
