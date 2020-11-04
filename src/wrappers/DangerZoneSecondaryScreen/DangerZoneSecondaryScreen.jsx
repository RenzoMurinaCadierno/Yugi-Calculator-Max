import React from "react"
import PropTypes from "prop-types"
import { classes } from "./DangerZoneSecondaryScreen.utils"
import styles from "./DangerZoneSecondaryScreen.module.css"

export default function DangerZoneSecondaryScreen({
  onProceed, // <function> callback to assign to "Proceed" <Button />
  onCancel, // <function> callback to assign to "Cancel" <Button />
  proceedDisabled, // <boolean> on true, "Proceed" <Button /> is disabled
  children // <function> dangerZoneChildrenJSX's getter function in utilityObject.js
}) {
  return (
    <div className={styles.Container}>
      {children({ styles, classes, onProceed, onCancel, proceedDisabled })}
    </div>
  )
}

DangerZoneSecondaryScreen.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  proceedDisabled: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
}
