import React from "react"
import PropTypes from "prop-types"
import { CSSTransition } from "react-transition-group"
import MiniCircle from "../MiniCircle/MiniCircle"

export default function MiniCircleWithTransition({
  triggerOn, // <boolean> true will mount the component and toggle its CSS Transition
  ...otherProps // <object> all other <MiniCircle /> props
}) {
  return (
    <CSSTransition
      in={triggerOn}
      timeout={100}
      component={null}
      classNames="grow"
      mountOnEnter
      unmountOnExit
    >
      <MiniCircle {...otherProps} />
    </CSSTransition>
  )
}

MiniCircleWithTransition.propTypes = {
  triggerOn: PropTypes.bool.isRequired
}
