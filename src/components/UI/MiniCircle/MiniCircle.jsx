import React, { memo, useCallback, useEffect } from "react"
import useToggle from "../../../hooks/useToggle"
import PropTypes from "prop-types"
import { classes, inlineStyles } from "./MiniCircle.utils"

function MiniCircle({
  display, // <string|number|React.node> <span>'s children, what is shown inside <MiniCircle />
  isActive, // <boolean> highlights this component if true
  onClick = null, // <function> component's onClick callback
  stopPropagation, // <boolean> prevents propagation if true
  animateOnClick, // <boolean> true will play a "grow-and-shrink" animation on click
  animateOnDisplayChange, // <boolean> same as animateOnClick but when display changes
  addNumberColorIndicator, // <boolean> adds a hue+brightness change on display change
  ariaLabel, // <string> aria-label for rendered <span>
  ariaPressed, // <boolean> aria-pressed for rendered <span> if role is "button"
  role, // <string> aria-role for rendered <span>
  style, // <object> inline styling for rendered <span>
  classNames // <Array> array of classNames strings.
}) {
  // state and toggler for "grow" animation if any "animate" prop was defined
  const [growState, toggleGrow] = useToggle(false)

  const handleClick = useCallback((e) => {
    // stopPropagation if told so in props. Also, trigger set growState to true
    // is animateOnClick = true, which triggers the second useEffect. Otherwise,
    // just trigger onClick callback
    stopPropagation && e.stopPropagation()
    animateOnClick ? toggleGrow() : onClick()
  }, [])

  useEffect(() => {
    // on display prop change and if animateOnDisplayChange = true, toggle growState
    // which triggers useEffect below. animateOnClick triggers that useEffect too,
    // so specifically check for it. If it is also true, then nullify this useEffect
    animateOnDisplayChange && !animateOnClick && toggleGrow()
  }, [display])

  useEffect(() => {
    let growTimeOut
    // truthy growState means a useEffect above triggered. Set timeout to toggle
    // growState off and call for onClick callback if it is defined
    if (growState)
      growTimeOut = setTimeout(() => {
        toggleGrow()
        onClick && onClick()
      }, 100)
    // clear timeout on cleanup, which assures no collision on multiple clicks
    // in a short period of time
    return () => growTimeOut && clearTimeout(growTimeOut)
  }, [growState])

  return (
    <span
      aria-label={ariaLabel}
      role={role}
      aria-pressed={ariaPressed}
      style={inlineStyles.container(display, style, addNumberColorIndicator)}
      className={classes.container(
        isActive,
        onClick,
        animateOnClick,
        animateOnDisplayChange,
        growState,
        classNames
      )}
      onClick={handleClick}
    >
      {display}
    </span>
  )
}

MiniCircle.propTypes = {
  display: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node
  ]),
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  stopPropagation: PropTypes.bool,
  animateOnClick: PropTypes.bool,
  animateOnDisplayChange: PropTypes.bool,
  addNumberColorIndicator: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaPressed: PropTypes.bool,
  role: PropTypes.string,
  style: PropTypes.object,
  classNames: PropTypes.arrayOf(PropTypes.string)
}

export default memo(MiniCircle)
