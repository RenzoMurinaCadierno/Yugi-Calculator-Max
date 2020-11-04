import React from "react"
import styles from "./OptionSwitchesCategory.module.css"

export default function OptionSwitchesCategory({ children, width }) {
  return (
    <div className={styles.Container} style={{ width: `${width || 100}%` }}>
      {children}
    </div>
  )
}
