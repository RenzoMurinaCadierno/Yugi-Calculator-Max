import React from "react"
import PropTypes from "prop-types"
import { classes } from "./OptionsTitle.utils"

export default function OptionsTitle({ children, classNames }) {
  return <div className={classes.container(classNames)}>{children}</div>
}

OptionsTitle.propTypes = {
  children: PropTypes.node.isRequired
}
