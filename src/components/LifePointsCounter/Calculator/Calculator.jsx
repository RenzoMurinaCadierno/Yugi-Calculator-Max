import React, { useContext, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { LPContext } from "../../../contexts/LPContext"
import { TimerContext } from "../../../contexts/TimerContext"
import { UIContext } from "../../../contexts/UIContext"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import Toast from "../../UI/Toast/Toast"
import CalculatorLeftSide from "../CalculatorLeftSide/CalculatorLeftSide"
import CalcButton from "../CalcButton/CalcButton"
import CalculatorRightSide from "../CalculatorRightSide/CalculatorRightSide"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes, calcButtons } from "./Calculator.utils"
import styles from "./Calculator.module.css"

function Calculator({
  showCalcButtons, // <boolean> on true, Calculator is in full view (calculator buttons shown)
  switchSFX // <object> useAudio()'s contol object for calculator buttons toggling
}) {
  // log switch state and setter is grabbed from LPContext as its state should
  // persist between components. Log action dispatch comes from there too
  const { switchState, setSwitch, dispatchLogAction } = useContext(LPContext)
  // grab all needed UI state and handlers from UIContext
  const {
    toggleSecondScreen,
    toastState,
    dispatchToastAction,
    screenIsFrozen
  } = useContext(UIContext)
  // and timer context variables too
  const { timerObject, previousInitialTime, isTimerRunning } = useContext(
    TimerContext
  )

  const handleToggleToast = useCallback(() => {
    // toggler to assign to the "X" button in toasts to close them
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  return (
    <>
      {/* <Toast /> to show coin/die/timer log changes */}
      <Toast
        show={
          toastState.isActive &&
          toastState.type === uiConfigs.togglers.toast.logSwitches
        }
        toggler={handleToggleToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveCalcSwitches}
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
      >
        <div className={styles.ToastText}>
          {toastState.text} <br />
          {/* log texts should transition in list form, dependent on each other */}
          <TransitionGroup component={null}>
            {toastState.logTypeArray.map((log) => (
              <CSSTransition
                key={log}
                component={null}
                timeout={500}
                classNames="log-type-in-out"
              >
                <span className={styles.ToastLogItems}> {log} </span>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </Toast>
      {/* from here on, we are in component's "visible" static area. 
      <Toast /> renders only upon being called, this one is always active.*/}
      <section className={classes.container(showCalcButtons)}>
        {/* Timer/Progressbar holder component. CSS Transition it to "flicker" in/out
        when showCalcButtons state toggles */}
        <CSSTransition
          in={showCalcButtons}
          component={null}
          timeout={400}
          classNames="flicker-calc-sides"
        >
          <CalculatorLeftSide
            isExpanded={showCalcButtons}
            switchSFX={switchSFX}
            toggleSecondScreen={toggleSecondScreen}
            timerObject={timerObject}
            previousInitialTime={previousInitialTime}
            isTimerRunning={isTimerRunning}
            switchState={switchState}
            setSwitch={setSwitch}
            dispatchLogAction={dispatchLogAction}
            dispatchToastAction={dispatchToastAction}
          />
        </CSSTransition>
        {/* calculator buttons. CSS Transition their wrapper section to smooth animate
        them in and out when showCalcButton state toggles */}
        <CSSTransition
          in={showCalcButtons}
          component={null}
          timeout={180}
          mountOnEnter
          unmountOnExit
          classNames="toggle-calc-button"
        >
          <div className={styles.MidColumn}>
            {calcButtons.buttonsArray.map((b) => (
              <CalcButton
                key={b.label}
                value={b.label}
                nonStyledDisabled={screenIsFrozen}
                dataId={b.type}
                ariaLabel={b.ariaLabel || ""}
                timerObject={timerObject}
                isTimerRunning={isTimerRunning}
                dispatchLogAction={dispatchLogAction}
                toggleSecondScreen={toggleSecondScreen}
              >
                {b.label}
              </CalcButton>
            ))}
          </div>
        </CSSTransition>
        {/* Die/Coin/Token holder component. CSS Transition it to "flicker" in/out
        when showCalcButton state toggles */}
        <CSSTransition
          in={showCalcButtons}
          component={null}
          timeout={400}
          classNames="flicker-calc-sides"
        >
          <CalculatorRightSide
            isExpanded={showCalcButtons}
            toggleSecondScreen={toggleSecondScreen}
          />
        </CSSTransition>
      </section>
    </>
  )
}

Calculator.propTypes = {
  showCalcButtons: PropTypes.bool.isRequired,
  switchSFX: PropTypes.object.isRequired
}

export default memo(Calculator)
