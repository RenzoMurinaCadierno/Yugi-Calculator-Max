import React from "react"
import PropTypes from "prop-types"
import styles from "./CoinDieTokenBottomScreen.module.css"

export default function CoinDieTokenBottomScreen({ ariaLabel, children }) {
  return (
    <div className={styles.Container} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

CoinDieTokenBottomScreen.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
