import React from "react"
import PropTypes from "prop-types"
import { classes } from "./OptionBody.utils"

export default function OptionBody({ children, classNames = [] }) {
  return <div className={classes.container(classNames)}>{children}</div>
}

OptionBody.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string)
}
