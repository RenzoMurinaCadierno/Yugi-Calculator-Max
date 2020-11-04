import React, { useState, useEffect, memo } from "react"
import PropTypes from "prop-types"
import styles from "./Button.module.css"

/**
 * IMPORTANT. This was my very first component, and that's why classNames here are
 * treated as string names that match the ones in its CSS modules file. I did not
 * change it to function like all other components across the app just due to
 * nostalgia sake. Sorry
 */
function Button({
  children, // <any>
  type = "default", // <string> "primary" or "secondary". Will apply different styles
  typeButton, // <boolean> true will assign type="button" to the rendered element
  typeSubmit, // <boolean> true will assign type="submit" to the rendered element
  reference, // <React.createRef> a reference to the rendered button
  ariaLabel, // <string> aria-label
  ariaPressed, // <boolean> aria-pressed state
  dataId, // <string> data-id
  disabled, // <boolean> button's disabled state
  nonStyledDisabled = false, // <boolean> same as disabed, but no "disabled" button styles will apply
  onClick = null, // <function> on click callback
  onBlur, // <function> on blur callback
  style, // <object> CSS inline styles
  sutileAnimation, // <boolean> true will set grow scaling on minimal for a sutile click animation
  tabIndex, // <number> tab-index
  classNames = []
}) {
  const [isActive, setIsActive] = useState(false)
  // classNames arrays
  const classes = [styles.Button]
  // push classes coming from props. Notice this is the only component that
  // accepts strings as classes and not an array of strings. I left it like
  // this to try something different, in order to use hard-coded classes
  // inside this same component. Might change in the future.
  classNames.forEach((c) => classes.push(styles[c]))
  // see? Pushing already coded classes depending on the string
  disabled && classes.push(styles.Disabled)
  if (isActive) {
    classes.push(styles.Highlight)
    sutileAnimation && classes.push(styles.GrowSmall)
  }
  // primary or secondary classes pushing by 'type' prop
  switch (type.toLowerCase()) {
    case "secondary":
      classes.push(styles.Secondary)
      break
    case "primary":
    default:
      classes.push(styles.Primary)
      break
  }

  const handleClick = (e) => {
    // if button is not disabled, set it as active and trigger its onClick
    if (!disabled) {
      setIsActive(true)
      onClick && onClick(e)
    }
  }

  useEffect(() => {
    // when clicked, set a timeout to deactivate it. In the meantime, it
    // will be highlighted by the added class
    let highlightTimer
    if (isActive) {
      highlightTimer = setTimeout(() => {
        setIsActive(false)
      }, 200)
    }
    return () => highlightTimer && clearTimeout(highlightTimer)
  }, [isActive])

  return (
    <button
      type={typeButton ? "button" : typeSubmit ? "submit" : null}
      style={style}
      disabled={disabled || nonStyledDisabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      data-id={dataId}
      ref={reference}
      className={classes.join(" ")}
      onBlur={onBlur}
      tabIndex={tabIndex}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  typeButton: PropTypes.bool,
  typeSubmit: PropTypes.bool,
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  ariaLabel: PropTypes.string,
  ariaPressed: PropTypes.bool,
  dataId: PropTypes.string,
  disabled: PropTypes.bool,
  nonStyledDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  sutileAnimation: PropTypes.bool,
  tabIndex: PropTypes.number,
  classNames: PropTypes.arrayOf(PropTypes.string)
}

export default memo(Button)
