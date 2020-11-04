import React from "react"
import PropTypes from "prop-types"
import styles from "./OptionTitle.module.css"

export default function OptionTitle({ children }) {
  return <div className={styles.Container}> {children} </div>
}

OptionTitle.propTypes = {
  children: PropTypes.node.isRequired
}
