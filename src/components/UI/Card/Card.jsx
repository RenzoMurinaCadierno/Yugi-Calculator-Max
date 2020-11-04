import React, { memo } from "react"
import PropTypes from "prop-types"
import styles from "./Card.module.css"

function Card({
  children,
  type = "primary", // <string> "primary", "secondary" or "danger"
  role, // <string> ARIA role
  onClick = () => {}, // <function> on click callback
  style, // <object> CSS inline styles
  classNames = []
}) {
  // classNames arrays
  const classes = [styles.Container]
  // push classes coming from props to their respective arrays
  classNames.forEach((c) => classes.push(c))

  // before pushing "type" to classes array, check if it already exists
  // in it. If it does not, then push it. This is a failsafe if a className
  // with the same name as "type" is passed as prop via "classNames"
  const duplicateClassIndex = classes.indexOf(type)
  if (duplicateClassIndex === -1) {
    classes.push(styles[type[0].toUpperCase() + type.slice(1)])
  }

  return (
    <div
      style={style}
      className={classes.join(" ")}
      onClick={onClick}
      role={role}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  role: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  classNames: PropTypes.array
}

export default memo(Card)
