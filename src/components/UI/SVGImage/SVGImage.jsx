import React, { memo } from "react"
import PropTypes from "prop-types"
import { classes } from "./SVGImage.utils"

function SVGImage({
  src, // <string> path to img source
  type = "primary", // <string> "primary", "secondary", "disabed". Will apply CSS stypes
  alt, // <string> <img>'s alt
  style, // <object> inline CSS styling
  role, // <string> role of outermost component
  ariaPressed, // <boolean> aria-pressed if we assigned role="button"
  dataId, // <string> data-id
  dataExtra, // <string> data-extra
  onClick = null, // <function> on click callback
  classNames = [] // <Array> an array of className strings to assign to element
}) {
  return (
    <img
      src={src}
      type={type}
      alt={alt}
      style={style}
      role={role}
      aria-pressed={ariaPressed}
      data-id={dataId}
      data-extra={dataExtra}
      className={classes.container(type, classNames)}
      onClick={onClick}
    />
  )
}

SVGImage.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string,
  alt: PropTypes.string.isRequired,
  style: PropTypes.object,
  role: PropTypes.string,
  ariaPressed: PropTypes.bool,
  dataId: PropTypes.string,
  dataExtra: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  classNames: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func
}

export default memo(SVGImage)
