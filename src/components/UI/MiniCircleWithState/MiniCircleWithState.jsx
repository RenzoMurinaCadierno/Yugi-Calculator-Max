import React, { useState, useCallback } from "react"
import PropTypes from "prop-types"
import MiniCircleWithTransition from "../MiniCircleWithTransition/MiniCircleWithTransition"
// import styles from './MiniCircleWithState.module.css'

export default function MiniCircleWithState({
  initialValue = 0, // <number> initial state value, used in <MiniCircle /> display prop
  limit = 10, // <number> maximum value before rolling back to initial value
  ...otherMiniCircleProps // <object> all other props to pass to <MiniCircleWithTransition />
}) {
  // state and setter to handle "display" prop
  const [value, setValue] = useState(initialValue)

  const modifyValue = useCallback(
    // on <MiniCircleWithTransition /> click, increase value by one. If it
    // exceeds the limit, roll back to initialValue
    () =>
      setValue((prevValue) =>
        prevValue >= limit ? initialValue : prevValue + 1
      ),
    [initialValue, limit]
  )
  return (
    <MiniCircleWithTransition
      triggerOn
      display={value}
      onClick={modifyValue}
      {...otherMiniCircleProps}
    />
  )
}

MiniCircleWithState.propTypes = {
  initialValue: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
}
