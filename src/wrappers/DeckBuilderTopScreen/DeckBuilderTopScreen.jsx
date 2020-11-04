import React from "react"
import PropTypes from "prop-types"
import { classes } from "./DeckBuilderTopScreen.utils"
import styles from "./DeckBuilderTopScreen.module.css"

export default function DeckBuilderTopScreen({
  ariaLabel,
  children,
  style,
  classNames
}) {
  return (
    <div
      aria-label={ariaLabel}
      style={style}
      className={classes.container(classNames)}
    >
      {children}
    </div>
  )
}

DeckBuilderTopScreen.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  classNames: PropTypes.arrayOf(PropTypes.string)
}
