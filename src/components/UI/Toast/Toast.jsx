import React, { useEffect, memo } from "react"
import PropTypes from "prop-types"
import { CSSTransition } from "react-transition-group"
import cross from "../../../assets/uiIcons/cross.svg"
import { classes } from "./Toast.utils"

function Toast({
  show, // <boolean> on true, this component becomes active (appears on screen)
  toggler, // <function> setter for "show" prop. Needed as a callback to close toast on "X"
  inactiveTimeout, // <number> timeout to call for "toggler", in ms
  children, // <any> component's content
  refreshTimeoutOn, // <boolean> whenever this prop changes, timeout will reset
  classNames = {} // <object> classNames object. Check propTypes below for its constitution
}) {
  useEffect(() => {
    // show triggers the toast (sets it as active). When so, set a timeout to
    // unmount it. Additionally, listen to refreshTimeoutOn to restart
    // that timeout (this keeps the toast active to changes).
    // An alternative would be to listen to children, but the drawback on this
    // approach is that anything that re-renders children will also reset the
    // timer. For example, timer ticking re-renders log texts, so each tick will
    // reset the toast.
    let unmountingTimeout
    if (show) unmountingTimeout = setTimeout(toggler, inactiveTimeout)
    return () => unmountingTimeout && clearTimeout(unmountingTimeout)
  }, [show, refreshTimeoutOn, inactiveTimeout, toggler])

  return (
    <CSSTransition
      unmountOnExit
      mountOnEnter
      in={show}
      component={null}
      timeout={250}
      classNames="toast-in-out"
    >
      <div className={classes.container(classNames.container)}>
        <div role="status" className={classes.children(classNames.children)}>
          {children}
        </div>
        <img
          src={cross}
          alt="Dismiss"
          role="button"
          className={classes.cross(classNames.cross)}
          onClick={toggler}
        />
      </div>
    </CSSTransition>
  )
}

Toast.propTypes = {
  show: PropTypes.bool.isRequired,
  toggler: PropTypes.func.isRequired,
  inactiveTimeout: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    cross: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(Toast)
