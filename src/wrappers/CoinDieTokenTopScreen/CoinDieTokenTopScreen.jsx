import React from "react"
import PropTypes from "prop-types"
import styles from "./CoinDieTokenTopScreen.module.css"

export default function CoinDieTokenTopScreen({ ariaLabel, children }) {
  return (
    <div className={styles.Container} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

CoinDieTokenTopScreen.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
