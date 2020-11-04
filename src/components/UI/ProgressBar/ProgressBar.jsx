import React, { memo } from "react"
import PropTypes from "prop-types"
import Timer from "../../LifePointsCounter/Timer/Timer"
import { classes, inlineStyles } from "./ProgressBar.utils"

function ProgressBar({
  currentValue, // <number> current progressbar value
  maxValue, // <number> maximum (total) value
  disabled = false, // <boolean> disabled state
  showTimer = true, // <boolean> true will render <Timer /> component inside progressbar
  showProgress = true, // <boolean> true will "paint" the background using "width" inline style
  showPercentage = false, // <boolean> true will render a <span> with current progress percentage
  timerConfigs = {}, // <object> <Timer /> required props
  dataId, // string> outermost element's aria-label
  onClick = () => {}, // <function> on click callback
  classNames = {} // <object> classNames object. Check propTypes below for its constitution
}) {
  // sinple progress calculation for width in %
  const currentPercentage = 100 - (currentValue / maxValue) * 100

  return (
    <div
      className={classes.container(classNames.container)}
      data-id={dataId}
      onClick={disabled ? null : onClick}
    >
      {showTimer && Object.keys(timerConfigs).length && (
        <Timer
          timerObject={timerConfigs.timerObject}
          ariaLabel={timerConfigs.ariaLabel}
          onClick={timerConfigs.onClick}
          classNames={classes.timer(classNames.timer)}
        />
      )}
      <div
        className={classes.progress(classNames.progress)}
        style={inlineStyles.container(currentPercentage, showProgress)}
      />
      {showPercentage && (
        <div className={classes.percentage(classNames.percentage)}>
          {Math.round(Math.floor(100 - currentPercentage))}%
        </div>
      )}
    </div>
  )
}

ProgressBar.propTypes = {
  currentValue: PropTypes.number,
  maxValue: PropTypes.number,
  disabled: PropTypes.bool,
  showTimer: PropTypes.bool,
  showProgress: PropTypes.bool,
  showPercentage: PropTypes.bool,
  timerConfigs: PropTypes.shape({
    hs: PropTypes.number,
    mins: PropTypes.number,
    secs: PropTypes.number
  }),
  dataId: PropTypes.string,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    progress: PropTypes.arrayOf(PropTypes.string),
    percentage: PropTypes.arrayOf(PropTypes.string),
    timer: PropTypes.arrayOf(PropTypes.string)
  }),
  onClick: PropTypes.func
}

export default memo(ProgressBar)
