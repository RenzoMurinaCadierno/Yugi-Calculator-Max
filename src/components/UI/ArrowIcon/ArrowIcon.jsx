import React, { memo, useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import arrow from "../../../assets/uiIcons/arrow2.svg"
import { classes } from "./ArrowIcon.utils"
import styles from "./ArrowIcon.module.css"

function ArrowIcon({
  id,
  component = "div", // <string> component defaults as <div>, but we also use it as <nav>
  pointing = "Left", // <string> the string to dynamically generate classes to rotate the arrow
  arrowImage = null, // <string> the path to icon image to use instead of the default 'arrow'
  alt = "", // <string> alt prop for the image
  extraText = null, // <string> text to show in a span besides the img
  disabled = false, // <boolean> disabled condition
  role, // <string> ARIA role
  dataId, // <string> data-id
  dataExtra, // <string> data-extra
  style, // <object> inline CSS styling
  classNames = {},
  onClick = null // <function> onClick callback for outermost element
}) {
  const [isActive, setIsActive] = useState(false)
  // customize component tag (we use this component as "nav" and as "div")
  const Component = component
  // if direction is provided, it can state any direction (Up, Bottom-Right, and so on)
  // We need to make sure both words are capitalized and joined correctly.
  const direction = pointing
    ? pointing
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("-")
    : "Left"

  const handleOnClick = useCallback(
    (e) => {
      // if onClick is defined, set this component as active and trigger onClick
      if (onClick) {
        setIsActive(true)
        onClick(e)
      }
    },
    [setIsActive, onClick]
  )

  useEffect(() => {
    // once this component becomes active, inactivate it after timeout.
    // This is mainly due to active classes toggling
    let activeTimeout
    if (onClick && isActive) {
      activeTimeout = setTimeout(() => {
        setIsActive(false)
      }, 150)
    }
    return () => activeTimeout && clearTimeout(activeTimeout)
  }, [onClick, isActive])

  return (
    <Component
      id={id}
      data-id={dataId}
      data-extra={dataExtra}
      role={role}
      style={style}
      className={classes.container(
        disabled,
        onClick,
        isActive,
        classNames.container
      )}
      onClick={disabled ? null : handleOnClick}
    >
      <img
        src={arrowImage ? arrowImage : arrow}
        alt={alt || `Arrow ${pointing}`}
        className={classes.image(disabled, direction, classNames.arrow)}
      />
      {extraText && (
        <span className={classes.extraText(disabled, classNames.text)}>
          {extraText}
        </span>
      )}
    </Component>
  )
}

ArrowIcon.propTypes = {
  id: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  component: PropTypes.string,
  pointing: PropTypes.string,
  arrowImage: PropTypes.string,
  extraText: PropTypes.string,
  disabled: PropTypes.bool,
  alt: PropTypes.string,
  role: PropTypes.string,
  dataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataExtra: PropTypes.any,
  style: PropTypes.object,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    arrow: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.arrayOf(PropTypes.string)
  }),
  onClick: PropTypes.func
}

export default memo(ArrowIcon)
