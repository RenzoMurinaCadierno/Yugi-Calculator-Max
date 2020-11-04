import React, { useContext, useCallback } from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import { TimerContext } from "../../../contexts/TimerContext"
import { LPContext } from "../../../contexts/LPContext"
import { LocalStorageContext } from "../../../contexts/LocalStorageContext"
import * as lifePointsActionCreators from "../../../store/LifePoints/lifePointsActionCreators"
import { restartConfirm } from "../../../utils/utilityObjects"
import Button from "../../UI/Button/Button"
import tick from "../../../assets/uiIcons/tick.svg"
import cross from "../../../assets/uiIcons/cross.svg"
import { classes } from "./RestartConfirmScreen.utils"
import styles from "./RestartConfirmScreen.module.css"

export default function RestartConfirmScreen({ toggleSecondScreen, confirm }) {
  // <Button />s adjust to device orientation (mq).
  // Restarting modifies both players tracked lifepoints and dispatch logging and
  // lifepoints reducer actions (dispatchLogAction, dispatchLPAction).
  // Logging action requires the timer object and current timer running state
  // (timerObject, isTimerRunning).
  // Finally, to modify players lifepoints in local storage, we need to know
  // if they are initially valid as to restart the duel (getLSasJSObject)
  const { mq } = useContext(MediaQuery)
  const { dispatchLogAction, dispatchLPAction } = useContext(LPContext)
  const { isTimerRunning, timerObject } = useContext(TimerContext)
  const { getLSasJSObject } = useContext(LocalStorageContext)

  const resetGameAndToggleScreen = useCallback(() => {
    // dispatch restart action in LP reducer and toggle Secondary Screen off
    dispatchLPAction(
      lifePointsActionCreators.restart({
        isTimerRunning,
        timerObject,
        dispatchLogAction,
        getLSasJSObject,
        dispatchLPAction
      })
    )
    toggleSecondScreen()
  }, [
    toggleSecondScreen,
    isTimerRunning,
    timerObject,
    dispatchLPAction,
    dispatchLogAction,
    getLSasJSObject
  ])

  return (
    <>
      {confirm ? (
        <div className={classes.restartConfirm}>{restartConfirm.message}</div>
      ) : (
        <>
          <div className={styles.Message}> Start a new duel? </div>
          <div className={styles.Buttons}>
            <Button
              type="primary"
              onClick={resetGameAndToggleScreen}
              classNames={classes.button(mq.portrait)}
            >
              Restart
              <img
                className={styles.TickImage}
                src={tick}
                alt="start new duel"
              />
            </Button>
            <Button
              type="secondary"
              onClick={toggleSecondScreen}
              classNames={classes.button(mq.portrait)}
            >
              Cancel
              <img className={styles.CancelImage} src={cross} alt="cancel" />
            </Button>
          </div>
        </>
      )}
    </>
  )
}

RestartConfirmScreen.propTypes = {
  toggleSecondScreen: PropTypes.func.isRequired,
  confirm: PropTypes.bool.isRequired
}
