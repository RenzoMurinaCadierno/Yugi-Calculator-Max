import React, { useContext, useCallback } from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import Button from "../../UI/Button/Button"
import styles from "./LogDeleteScreen.module.css"
import trash from "../../../assets/uiIcons/trash.svg"
import cross from "../../../assets/uiIcons/cross.svg"
import { classes } from "./LogDeleteScreen.utils"

export default function LogDeleteScreen({
  toggleSecondScreen, // <function> UIContext's <SecondaryScreen /> toggler
  deleteLSLogHistory // <function> LogContext's action to delete logs from local storage
}) {
  // <Button>'s classNames change depeding on device orientation, so bring
  // media query object from context
  const { mq } = useContext(MediaQuery)

  const deleteLogsAndToggleSecondScreen = useCallback(() => {
    deleteLSLogHistory()
    toggleSecondScreen()
  }, [deleteLSLogHistory, toggleSecondScreen])

  return (
    <>
      <div className={styles.Message}> Delete all logs? </div>
      <div className={styles.Buttons}>
        <Button
          type="primary"
          classNames={classes.button(mq.portrait)}
          onClick={deleteLogsAndToggleSecondScreen}
        >
          Delete
          <img className={styles.DeleteImage} src={trash} alt="delete logs" />
        </Button>
        <Button
          type="secondary"
          classNames={classes.button(mq.portrait)}
          onClick={toggleSecondScreen}
        >
          Cancel
          <img className={styles.CancelImage} src={cross} alt="cancel" />
        </Button>
      </div>
    </>
  )
}

LogDeleteScreen.propTypes = {
  toggleSecondScreen: PropTypes.func.isRequired,
  deleteLSLogHistory: PropTypes.func.isRequired
}
