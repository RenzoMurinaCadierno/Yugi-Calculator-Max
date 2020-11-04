import React, { useCallback } from "react"
import PropTypes from "prop-types"
import arrow from "../../../assets/uiIcons/arrow2.svg"
import useToggle from "../../../hooks/useToggle"
import { classes } from "./RotatableArrowIcon.utils"

export default function RotatableArrowIcon({
  pointing = "Left", // <string> the string to dynamically generate classes to rotate the arrow
  preventRotation = false, // <boolean> true locks arrow image in place instead of rotating it
  ariaLabel = `Arrow ${pointing}`, // <string> ARIA label to assign to wrapper div
  role, // <string> ARIA role, generally button
  classNames = {}, // <object> classNames object. Check propTypes below for its constitution
  onClick = () => {}
}) {
  // toggler to keep rotation status
  const [isArrowRotated, rotateArrow] = useToggle(false)
  // rotation string to match classNames (like "Left", "UpRight", "DownLeft")
  const direction =
    pointing.charAt(0).toUpperCase() + pointing.slice(1).toLowerCase()

  const containerClick = useCallback(
    (e) => {
      // if rotation is not prevented, toggle its state, which injects the class that
      // rotates the image depending on which "pointing" state is being applied.
      // Afterwards, trigger onClick callback
      e.persist()
      !preventRotation && rotateArrow()
      onClick(e)
    },
    [preventRotation, rotateArrow, onClick]
  )

  return (
    <div
      id={pointing}
      aria-label={ariaLabel}
      role={role}
      onClick={containerClick}
      className={classes.container(classNames.container)}
    >
      <img
        id={pointing}
        src={arrow}
        alt={`Arrow ${pointing}`}
        className={classes.image(
          direction,
          isArrowRotated,
          preventRotation,
          classNames.image
        )}
      />
    </div>
  )
}

RotatableArrowIcon.propTypes = {
  pointing: PropTypes.string,
  preventRotation: PropTypes.bool,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.arrayOf(PropTypes.string)
  }),
  onClick: PropTypes.func
}
