import React from "react"
import PropTypes from "prop-types"
import styles from "./UICardContainer.module.css"

export default function UICardContainer({ children }) {
  return <div className={styles.Container}>{children}</div>
}

UICardContainer.propTypes = {
  children: PropTypes.node.isRequired
}
