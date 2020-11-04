import React, { memo } from "react"
import PropTypes from "prop-types"
import { classes } from "./Timer.utils"

function Timer({
  timerObject, // <object> timer reducer's timerObject {hs: <number>, mins: <number>, secs: <number>}
  ariaLabel, // <string> outermost <div> aria-label
  onClick = null, // <function> outermost <div> on click callback
  classNames = [] // <Array> array of className strings
}) {
  return (
    <div
      className={classes.container(classNames)}
      onClick={onClick}
      aria-label={ariaLabel || `Timer`}
    >
      {timerObject.hs + ":" + timerObject.mins + ":" + timerObject.secs}
    </div>
  )
}

Timer.propTypes = {
  timerObject: PropTypes.shape({
    hs: PropTypes.string,
    mins: PropTypes.string,
    secs: PropTypes.string
  }).isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string),
  ariaLabel: PropTypes.string,
  onClick: PropTypes.func
}

export default memo(Timer)
