import React from "react"
import PropTypes from "prop-types"
import styles from "./ErrorMessage.module.css"

export default function ErrorMessage({ children }) {
  return <div className={styles.Container}>{children}</div>
}

ErrorMessage.propTypes = {
  children: PropTypes.node.isRequired
}
