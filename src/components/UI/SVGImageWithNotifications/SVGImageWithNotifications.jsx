import React, { memo } from "react"
import PropTypes from "prop-types"
import MiniCircleWithTransition from "../MiniCircleWithTransition/MiniCircleWithTransition"
import { classes } from "./SVGImageWithNotifications.utils"

function SVGImageWithNotifications({
  dataId, // <string> data-id
  src, // <string> path to <img> source
  alt, // <string> <img>'s alt
  text, // <string> text to render in <span> for notification purposes
  miniCircleTrigger, // <boolean> <MiniCircleWithTransition />'s "triggerOn" prop
  miniCirclePosition, // <string> position to render <MiniCircle at. Must match its class in CSS file
  miniCircleDisplay, // <string|number|React.node> <MiniCircleWithTransition />'s "display" prop
  onClick, // <function> on click callback for outermost <div>
  disabled, // <boolean> component's disabled state
  role, // <string> element's role property
  ariaLabel, // <string> aria-label
  containerStyle, // <object> outermost <div>'s inline CSS style object
  textStyle, // <object> notification <span>'s inline CSS style object
  classNames = {}, // <object> classNames object. Check propTypes below for its constitution
  ...miniCircleProps // <object> all other props to pass to <MiniCircleWithTransition />
}) {
  return (
    <div
      data-id={dataId}
      disabled={disabled}
      onClick={disabled ? null : onClick}
      aria-label={ariaLabel}
      role={role}
      style={containerStyle}
      className={classes.container(classNames.container, disabled, onClick)}
    >
      <img
        data-id={dataId}
        src={src}
        alt={alt}
        className={classes.image(classNames.image)}
      />
      <span style={textStyle} className={classes.text(classNames.text)}>
        {text}
      </span>
      {miniCircleDisplay && (
        <MiniCircleWithTransition
          triggerOn={miniCircleTrigger}
          display={miniCircleDisplay}
          classNames={classes.miniCircle(
            classNames.miniCircle,
            miniCirclePosition
          )}
          {...miniCircleProps}
        />
      )}
    </div>
  )
}

SVGImageWithNotifications.propTypes = {
  dataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  triggerOn: PropTypes.bool,
  miniCircleTrigger: PropTypes.bool,
  miniCirclePosition: PropTypes.string,
  miniCircleDisplay: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.arrayOf(PropTypes.string),
    miniCircle: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(SVGImageWithNotifications)
