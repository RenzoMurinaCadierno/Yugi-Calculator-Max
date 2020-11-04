import React from "react"
import PropTypes from "prop-types"
import { classes } from "./CardSearchScreenDivision.utils"
import styles from "./CardSearchScreenDivision.module.css"

export default function CardSearchScreenDivision({ children, classNames }) {
  return <div className={classes.container(classNames)}>{children}</div>
}

CardSearchScreenDivision.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string)
}
