import React from "react"
import PropTypes from "prop-types"
import styles from "./TimerTopScreen.module.css"

export default function TimerTopScreen({ ariaLabel, onSubmit, children }) {
  return (
    <div className={styles.Container} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

TimerTopScreen.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  children: PropTypes.node.isRequired
}
