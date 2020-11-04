import React, { useEffect, useRef, useCallback, memo, useState } from "react"
import PropTypes from "prop-types"
import Input from "../Input/Input"
import { classes, getText } from "./InputWithLabel.utils"

function InputWithLabel({
  id,
  value, // <string> <input>'s value
  labelText, // <string> text to show on laben when not on focus
  labelTextOnFocus = "", // <string> same, but when being focused
  helpText, // <string> additional static text if needed (input's lower right corner)
  helpTextOnFocus, // <string> what to show in the additional text on input focus
  disabled, // <boolean> <label> and <input>'s disabled property
  classNames = {}, // <object> classNames object. Check propTypes below for its constitution
  ...otherProps // all other props passed to Input component
}) {
  // focused state boolean handler
  const [isFocused, setIsFocused] = useState(false)
  // to auto-trigger onBlur(), we need a reference to the input
  const inputRef = useRef()

  const onInputFocus = useCallback(() => {
    // on focus, set focus state to true
    !isFocused && setIsFocused(true)
  }, [isFocused, setIsFocused])

  const onInputBlur = useCallback(() => {
    // on blur, if the input does not hold a value, set focus state to false
    !value && setIsFocused(false)
  }, [value, setIsFocused, isFocused])

  useEffect(() => {
    // on a given change, if input is already focused and we are blurring
    // from it (a different active element), trigger onBlur()
    if (document.activeElement !== inputRef.current && isFocused) onInputBlur()
  })

  return (
    <div className={classes.container(classNames.container)}>
      <label
        htmlFor={id}
        className={classes.label(isFocused, disabled, classNames.label)}
      >
        {/* on component focus, show onFocusText. Otherwise, default one */}
        {getText(labelTextOnFocus, labelText, isFocused)}
      </label>
      <Input
        id={id}
        value={value}
        disabled={disabled}
        reference={inputRef}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        classNames={classes.input(classNames.input)}
        {...otherProps}
      />
      {helpText && (
        <span className={classes.helpText(isFocused, classNames.helpText)}>
          {/* same as <label> above */}
          {getText(helpTextOnFocus, helpText, isFocused)}
        </span>
      )}
    </div>
  )
}

InputWithLabel.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  labelText: PropTypes.string.isRequired,
  labelTextOnFocus: PropTypes.string,
  helpText: PropTypes.string,
  helpTextOnFocus: PropTypes.string,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.arrayOf(PropTypes.string),
    helpText: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(InputWithLabel)
