import React, { useContext, useCallback, useRef } from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import { TimerContext } from "../../../contexts/TimerContext"
import * as timerActionCreators from "../../../store/Timer/timerActionCreators"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import InputWithSubmit from "../../UI/InputWithSubmit/InputWithSubmit"
import Button from "../../UI/Button/Button"
import TimerBottomScreen from "../../../wrappers/TimerBottomScreen/TimerBottomScreen"
import TimerTopScreen from "../../../wrappers/TimerTopScreen/TimerTopScreen"
import { fillFrontOfInput } from "../../../utils/utilityFunctions"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes, ariaLabels } from "./TimerScreen.utils"
import styles from "./TimerScreen.module.css"

export default function TimerScreen({
  switchSFX, // <object> useAudio() controls object for BottomScreen's log button
  clickOKSFX, // <object> useAudio() controls object for BottomScreen's - button
  clickCancelSFX, // <object> useAudio() controls object for BottomScreen's + button
  dispatchToastAction // <function> <Toast /> action dispatcher, coming from UIContext
}) {
  const { mq } = useContext(MediaQuery)
  const {
    timerObject,
    isTimerFrozen,
    isTimerRunning,
    previousInitialTime,
    dispatchTimerAction,
    log,
    logDispatch
  } = useContext(TimerContext)
  const { hs, mins, secs } = timerObject
  // ref to the "Start" button, to click it on any input submit
  const startButtonRef = useRef()

  const dispatchLogAction = useCallback(
    (stage, hs, mins, secs) => {
      // log the action
      logDispatch(
        logActionCreators.log({
          type: uiConfigs.logTypes.timer,
          text: `${stage} at ${hs}:${mins}:${secs}`,
          timer: `${hs}:${mins}:${secs}`
        })
      )
    },
    [logDispatch]
  )

  const dispatchToggleLogAction = useCallback(() => {
    // toggle logging for coin actions, and show toast to notify it
    switchSFX.play()
    logDispatch(logActionCreators.toggle())
    dispatchToastAction(toastActionCreators.setLogType("TIMER"))
  }, [logDispatch, dispatchToastAction, switchSFX])

  const changeInput = useCallback(
    // dispatch changeTimerInput action to control hs/mins/secs inputs
    ({ target: { value, name } }) => {
      dispatchTimerAction(timerActionCreators.changeTimerInput({ name, value }))
    },
    [dispatchTimerAction]
  )

  const startTimer = () => {
    // create a timer object with current timerObject's hs, mins and secs.
    // If any field has less than two digits, fill them with zeroes
    let newTimerObject = {
      hs: fillFrontOfInput(timerObject.hs, "0", 2),
      mins: fillFrontOfInput(timerObject.mins, "0", 2),
      secs: fillFrontOfInput(timerObject.secs, "0", 2)
    }
    // on 00:00:00, use the fallback timer values (previously used initial time)
    if (
      newTimerObject.hs === "00" &&
      newTimerObject.mins === "00" &&
      newTimerObject.secs === "00"
    ) {
      newTimerObject = previousInitialTime
    }
    // play the OK sound effect, dispatch the timer action to start the timer
    // using the constructed timer object and log it
    clickOKSFX.restart()
    dispatchTimerAction(timerActionCreators.startTimer(newTimerObject))
    dispatchLogAction(
      "Started",
      newTimerObject.hs,
      newTimerObject.mins,
      newTimerObject.secs
    )
  }

  const toggleTimerFrozen = () => {
    // If the timer is paused, dispatch the action to pause it and log that
    // action. Else, just dispatch the action to unpause it
    clickCancelSFX.restart()
    !isTimerFrozen && dispatchLogAction("Paused", hs, mins, secs)
    dispatchTimerAction(timerActionCreators.toggleTimerFrozen())
  }

  const toggleTimerRunning = useCallback(() => {
    // if the timer was running (already started), dispatch the action to
    // stop it. Log it too
    clickCancelSFX.restart()
    dispatchLogAction("Stopped", hs, mins, secs)
    dispatchTimerAction(timerActionCreators.toggleTimerRunning())
  }, [dispatchLogAction, dispatchTimerAction])

  const handleSubmit = useCallback(() => {
    // on any input submission, target "Start" button and click it
    startButtonRef.current && startButtonRef.current.click()
  }, [startButtonRef])

  return (
    <div className={styles.Container}>
      <TimerTopScreen ariaLabel="Click on each input to change the timer's hours/minutes/seconds values.">
        <InputWithSubmit
          type="tel"
          value={hs}
          name="hs"
          ariaLabel={`${hs} hours`}
          disabled={isTimerRunning}
          autoComplete="off"
          onChange={changeInput}
          onSubmit={handleSubmit}
          preventDefault
          classNames={classes.inputWithSubmit}
        />
        <div>:</div>
        <InputWithSubmit
          type="tel"
          value={mins}
          name="mins"
          ariaLabel={`${mins} minutes`}
          disabled={isTimerRunning}
          autoComplete="off"
          onChange={changeInput}
          onSubmit={handleSubmit}
          preventDefault
          classNames={classes.inputWithSubmit}
        />
        <div>:</div>
        <InputWithSubmit
          type="tel"
          value={secs}
          name="secs"
          ariaLabel={`${secs} seconds`}
          disabled={isTimerRunning}
          autoComplete="off"
          onChange={changeInput}
          onSubmit={handleSubmit}
          preventDefault
          classNames={classes.inputWithSubmit}
        />
      </TimerTopScreen>
      <TimerBottomScreen ariaLabel="Control the timer with the these buttons.">
        <Button
          type="secondary"
          disabled={isTimerRunning}
          onClick={startTimer}
          ariaLabel={ariaLabels.startTimer(isTimerRunning)}
          reference={startButtonRef}
          classNames={classes.actionButton(mq.portrait)}
        >
          Start
        </Button>
        <Button
          type={isTimerFrozen ? "primary" : "secondary"}
          disabled={!isTimerRunning}
          onClick={toggleTimerFrozen}
          ariaLabel={ariaLabels.freezeTimer(isTimerRunning, isTimerFrozen)}
          classNames={classes.actionButton(mq.portrait)}
        >
          Pause
        </Button>
        <Button
          type="secondary"
          disabled={!isTimerRunning}
          onClick={toggleTimerRunning}
          ariaLabel={ariaLabels.stopTimer(isTimerRunning)}
          classNames={classes.actionButton(mq.portrait)}
        >
          Stop
        </Button>
        <Button
          type={log.logState ? "primary" : "secondary"}
          onClick={dispatchToggleLogAction}
          ariaLabel={ariaLabels.logTimer(log.logState)}
          ariaPressed={log.logState}
          classNames={classes.logButton(mq.portrait, log.logState)}
        >
          Log {log.logState ? "ON" : "OFF"}
        </Button>
      </TimerBottomScreen>
    </div>
  )
}

TimerScreen.propTypes = {
  switchSFX: PropTypes.object.isRequired,
  clickOKSFX: PropTypes.object.isRequired,
  clickCancelSFX: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}
