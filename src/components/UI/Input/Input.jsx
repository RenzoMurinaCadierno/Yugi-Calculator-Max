import React, { memo } from "react"
import PropTypes from "prop-types"
import { classes } from "./Input.utils"
import styles from "./Input.module.css"

function Input({
  id,
  type = "text", // <string> input's type
  value = "", // <string> input's value
  name, // <string> input's name property
  placeholder, // <string> input's placeholder property
  ariaLabel, // <string> aria-label
  role, // <string> aria-role
  autoComplete, // <string> input's autocomplete property ("on", "off")
  disabled = false, // <boolean> disabled state
  reference = null, // <React.useRef> a reference targetting the input
  onChange = () => {}, // <function> input's on change callback
  onFocus = () => {}, // <function> input's on focus callback
  onBlur = () => {}, // <function> input's on blur callback
  classNames = [] // <Array> classNames strings in an array
}) {
  // // classNames arrays
  // const classes = [styles.Container, disabled ? styles.Disabled : ""]
  // // push classes coming from props to their respective arrays
  // classNames.forEach((c) => classes.push(c))

  return (
    <input
      id={id}
      type={type}
      value={value}
      name={name}
      placeholder={placeholder}
      aria-label={ariaLabel}
      role={role}
      autoComplete={autoComplete}
      disabled={disabled}
      ref={reference}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={classes.container(disabled, classNames)}
    />
  )
}

Input.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  classNames: PropTypes.arrayOf(PropTypes.string)
}

export default memo(Input)
