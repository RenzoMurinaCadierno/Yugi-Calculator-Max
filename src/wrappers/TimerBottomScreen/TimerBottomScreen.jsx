import React from "react"
import PropTypes from "prop-types"
import styles from "./TimerBottomScreen.module.css"

export default function TimerBottomScreen({ ariaLabel, children }) {
  return (
    <div className={styles.Container} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

TimerBottomScreen.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
