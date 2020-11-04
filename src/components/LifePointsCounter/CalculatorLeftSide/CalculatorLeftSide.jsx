import React, { useState, useEffect, useCallback, useRef, memo } from "react"
import PropTypes from "prop-types"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import ProgressBar from "../../UI/ProgressBar/ProgressBar"
import Slider from "../../UI/Slider/Slider"
import { getTimerProgressBarValue } from "../../../utils/utilityFunctions"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./CalculatorLeftSide.utils"

function CalculatorLeftSide({
  isExpanded, // <boolean> on true, calculator buttons were hidden. View should change accordingly
  switchSFX, // <object> switch sound effect audio controls
  toggleSecondScreen, // <function> secondary screen toggler
  timerObject, // <object> current timer object { hs: <number>, mins: <number>, secs: <number>}
  previousInitialTime, // <object> previous time the timer started at { hs: <number>, mins: <number>, secs: <number>}
  isTimerRunning, // <boolean> true if timer has started
  switchState, // <boolean> LPContext switch state to show logging UI
  setSwitch, // <function> switch toggler for switchState
  dispatchLogAction, // <function> log reducer action dispatcher
  dispatchToastAction // <function> toast reducer action dispatcher
}) {
  // state to hold all necessary values to paint the progress bar
  const [progressArray, setProgressArray] = useState([])
  // isMounting will prevent lifepoints log from toggling or playing SFX at mount phase
  const isMounting = useRef(true)

  const dispatchToggleLPLogAction = useCallback(() => {
    // on mount, do NOT switch nor play its SFX
    if (isMounting.current) isMounting.current = false
    else {
      // ON/OFF log switch happened. Play its SFX, dispatch the log action that
      // toggles it on/off, and the Toast action to notify the user
      switchSFX.play()
      dispatchLogAction(logActionCreators.toggle())
      dispatchToastAction(toastActionCreators.setLogType("LIFEPOINTS"))
    }
  }, [dispatchLogAction, dispatchToastAction, switchSFX.isOn])

  const handleToggleSecondScreen = useCallback(
    (e) => {
      // we second screen using <ProgressBar />'s data-id as type
      toggleSecondScreen(e.target.dataset.id)
    },
    [toggleSecondScreen]
  )

  useEffect(() => {
    // we gets all required values to paint the progress bar, and set them in state
    setProgressArray(getTimerProgressBarValue(timerObject, previousInitialTime))
  }, [timerObject, previousInitialTime])

  return (
    <aside className={classes.container(isExpanded)}>
      <Slider
        switchState={switchState}
        setSwitch={setSwitch}
        onSwitchOn={dispatchToggleLPLogAction}
        onSwitchOff={dispatchToggleLPLogAction}
        textON="LOG ON"
        textOFF="LOG OFF"
        ariaLabelOn="Toggle life points log. Current state: ON"
        ariaLabelOff="Toggle life points log. Current state: OFF"
        classNames={classes.slider(isExpanded)}
      />
      <ProgressBar
        currentValue={progressArray[1]}
        maxValue={progressArray[2]}
        showProgress={
          // we show progressbar only if stated in configs and if timer is not stopped
          uiConfigs.calcConfigs.progressBar.showProgress && isTimerRunning
        }
        showPercentage={
          // we show percentage only if stated in configs and if timer is not stopped
          uiConfigs.calcConfigs.progressBar.showPercentage && isTimerRunning
        }
        showTimer={uiConfigs.calcConfigs.progressBar.showTimer}
        timerConfigs={{
          // if the timer is not frozen, we display the current time in timerobject.
          // Otherwise, we always show the previously used initial time
          timerObject: isTimerRunning ? timerObject : previousInitialTime
        }}
        dataId={uiConfigs.togglers.secondaryScreens.timer}
        classNames={classes.progressBar(isExpanded)}
        onClick={handleToggleSecondScreen}
      />
    </aside>
  )
}

CalculatorLeftSide.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  switchSFX: PropTypes.object.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  timerObject: PropTypes.shape({
    hs: PropTypes.string,
    mins: PropTypes.string,
    secs: PropTypes.string
  }).isRequired,
  previousInitialTime: PropTypes.shape({
    hs: PropTypes.string,
    mins: PropTypes.string,
    secs: PropTypes.string
  }).isRequired,
  isTimerRunning: PropTypes.bool.isRequired,
  switchState: PropTypes.bool.isRequired,
  setSwitch: PropTypes.func.isRequired,
  dispatchLogAction: PropTypes.func.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}

export default memo(CalculatorLeftSide)
