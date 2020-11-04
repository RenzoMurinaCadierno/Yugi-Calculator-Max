import React from "react"
import PropTypes from "prop-types"
import { classes } from "./HalfScreenDivision.utils"

export default function HalfScreenDivision({
  ariaLabel, // <string> component's rendered html element's aria-label
  width, // <number> component's width to apply as inline style
  height, // <number> component's height to apply as inline style
  component = "div", // <string> component html element to render
  children,
  classNames // <array> array of className strings
}) {
  // capitalize component to follow React's components' logic
  const Component = component

  return (
    <Component
      aria-label={ariaLabel}
      className={classes.container(classNames)}
      // default width to 50 and height to 100 if they were not provided as props
      style={{ width: `${width ?? "50"}%`, height: `${height ?? "100"}%` }}
    >
      {children}
    </Component>
  )
}

HalfScreenDivision.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  component: PropTypes.string,
  children: PropTypes.node.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string)
}
