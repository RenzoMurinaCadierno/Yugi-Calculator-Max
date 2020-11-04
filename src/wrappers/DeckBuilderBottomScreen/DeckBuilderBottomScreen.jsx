import React from "react"
import PropTypes from "prop-types"
import { classes } from "./DeckBuilderBottomScreen.utils"

export default function DeckBuilderBottomScreen({
  ariaLabel,
  children,
  style,
  classNames
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={classes.container(classNames)}
      style={style}
    >
      {children}
    </div>
  )
}

DeckBuilderBottomScreen.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  classNames: PropTypes.arrayOf(PropTypes.string)
}
