import React, { useContext, useEffect, useCallback, useRef, memo } from "react"
import PropTypes from "prop-types"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { LPContext } from "../../../contexts/LPContext"
import { CoinDieTokenContext } from "../../../contexts/CoinDieTokenContext"
import { TimerContext } from "../../../contexts/TimerContext"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import Toast from "../../UI/Toast/Toast"
import OptionSwitchesCategory from "../../../wrappers/OptionSwitchesCategory/OptionSwitchesCategory"
import uiConfigs from "../../../utils/ui.configs.json"
import { getSVGImgJSX } from "./LogSwitches.utils"
import styles from "./LogSwitches.module.css"

function LogSwitches({
  width, // <number> width to assign OptionSwitchesCategory
  switchSFX, // <object> useAudioControls() object for switch toggle
  toastState, // <object> toast state in UIContext
  dispatchToastAction // <function> toast action dispatcher function
}) {
  // since we are controlling log switching state for lifepoints, dice, coin
  // and timer in this component, we need states and functions from their contexts
  const { lpLog, setSwitch, dispatchLogAction } = useContext(LPContext)
  const { diceLogReducer, coinLogReducer } = useContext(CoinDieTokenContext)
  const { log, logDispatch } = useContext(TimerContext)
  const [diceLog, dispatchDiceLogAction] = diceLogReducer
  const [coinLog, dispatchCoinLogAction] = coinLogReducer
  // isMounting will prevent sfx from playing at mount phase
  const isMounting = useRef(true)

  const handleDispatchToggleLogAction = useCallback(
    (logString, logActionDispatcher, setLPSwitch) => {
      // toggle the target log reducer state, and activate <Toast /> adding or
      // removing the log type string to its reducer state. If we are logging
      // "lifepoints", "setLPSwitch" will be defined as "setSwitch" callback
      // from LPReducer, whici toggles the Calculator's UI <Switch /> on/off
      logActionDispatcher(logActionCreators.toggle())
      dispatchToastAction(
        toastActionCreators.setLogType(logString.toUpperCase())
      )
      setLPSwitch && setLPSwitch((lpSwitchState) => !lpSwitchState)
    },
    [dispatchToastAction]
  )

  const handleToggleToast = useCallback(() => {
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  useEffect(() => {
    // do nothing on mount
    if (isMounting.current) isMounting.current = false
    // at any other instance, if a log state toggles ON/OFF, play the SFX
    else switchSFX.play()
  }, [diceLog.logState, lpLog.logState, coinLog.logState, log.logState])

  return (
    <>
      <Toast
        show={
          toastState.isActive &&
          toastState.type === uiConfigs.togglers.toast.logSwitches
        }
        toggler={handleToggleToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveConfigsSwitches}
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
      >
        <div className={styles.ToastText}>
          {toastState.text} <br />
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
      <OptionSwitchesCategory width={width}>
        <div className={styles.Title}> Logs </div>
        {getSVGImgJSX(
          "lifepoints",
          lpLog.logState,
          handleDispatchToggleLogAction,
          dispatchLogAction,
          setSwitch
        )}
        {getSVGImgJSX(
          "dice",
          diceLog.logState,
          handleDispatchToggleLogAction,
          dispatchDiceLogAction
        )}
        {getSVGImgJSX(
          "coins",
          coinLog.logState,
          handleDispatchToggleLogAction,
          dispatchCoinLogAction
        )}
        {getSVGImgJSX(
          "timer",
          log.logState,
          handleDispatchToggleLogAction,
          logDispatch
        )}
      </OptionSwitchesCategory>
    </>
  )
}

LogSwitches.propTypes = {
  width: PropTypes.number,
  switchSFX: PropTypes.object.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}

export default memo(LogSwitches)
