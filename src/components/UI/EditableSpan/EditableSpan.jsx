import React, { memo, useEffect } from "react"
import PropTypes from "prop-types"
import useDoubleTap from "../../../hooks/useDoubleTap"
import useToggle from "../../../hooks/useToggle"
import InputWithSubmit from "../../UI/InputWithSubmit/InputWithSubmit"
import { classes, inlineStyles } from "./EditableSpan.utils"

function EditableSpan({
  display, // <React.node> || <string> Input's value
  isEditingInput, // <boolean> editing state (true: show input, false: show span)
  toggleEditingInput, // <function> isEditingInput's toggler
  inputReferece, // <React.createRef> a reference to the input
  onInputSubmit, // <function> onSubmit's callback
  onInputChange, // <function> onChange's callback
  onInputBlur, // <function> onBlur's callback
  inputWithSubmitExtraProps, // <object> extra props to pass to <InputWithSubmit />
  configs = {}, // <object> config object with props to apply to <span> (check them below)
  classNames = {} // <object> classNames object. Check propTypes below for its constitution
}) {
  const {
    delayBetweenTaps, // <number> maximum ms delay between two taps to be considered a double tap
    showCharLimit, // <boolean> on true, remaining characters will be shown in an additional span
    maxCharLength, // <number> maximum allowed character length for both <input> and <span>
    spanDataId, // <span>'s data-id if any
    spanAriaLabel // <span>'s aria-label if any
  } = configs
  // fallback editing state and toggler if none are passed as props
  const [thisIsEditingInput, thisToggleEditingInput] = useToggle(false)
  // callback for when a double tap is triggered
  const call = useDoubleTap({ delayBetweenTaps })
  // double tap handler. Toggles editing state
  const handleDoubleTap = () =>
    call(toggleEditingInput ?? thisToggleEditingInput)
  // if outer editing state was passed, use it. Otherwise, use this component's
  const editingState = isEditingInput ?? thisIsEditingInput
  // once editing state is triggered, focus the input
  useEffect(() => {
    if (editingState && inputReferece) inputReferece.current.focus()
  }, [editingState, inputReferece])
  // if we are on editing state, show the input and a span with the
  // remaining available characters. If we are not editing, then just
  // show the span with the player name
  return editingState ? (
    <div className={classes.container(classNames.container)}>
      <InputWithSubmit
        value={display}
        reference={inputReferece}
        onChange={onInputChange}
        onBlur={onInputBlur}
        onSubmit={onInputSubmit}
        classNames={classes.inputWithSubmit(classNames.form, classNames.input)}
        {...inputWithSubmitExtraProps}
      />
      {showCharLimit && (
        <span
          className={classes.charLimit(classNames.charLimit)}
          aria-label="Remaining characters"
          // adjust hue and brightness between primary and secondary as
          // an extra effect on remaining characters
          style={inlineStyles.charLimit(display.length, maxCharLength)}
        >
          {maxCharLength - display.length}
        </span>
      )}
    </div>
  ) : (
    <span
      onClick={handleDoubleTap}
      className={classes.span(classNames.span)}
      data-id={spanDataId}
      aria-label={spanAriaLabel}
    >
      {display}
    </span>
  )
}

EditableSpan.propTypes = {
  display: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isEditingInput: PropTypes.bool,
  toggleEditingInput: PropTypes.func,
  inputReferece: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onInputSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onInputBlur: PropTypes.func,
  inputWithSubmitExtraProps: PropTypes.object,
  configs: PropTypes.shape({
    showCharLimit: PropTypes.bool,
    delayBetweenTaps: PropTypes.number,
    maxCharLength: PropTypes.number,
    spanAriaLabel: PropTypes.string,
    spanDataId: PropTypes.string
  }),
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    span: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.arrayOf(PropTypes.string),
    charLimit: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(EditableSpan)
