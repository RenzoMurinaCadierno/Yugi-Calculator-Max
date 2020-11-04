import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import useToggle from "../../../hooks/useToggle"
import { classes } from "./ExpandableIcon.utils"

function ExpandableIcon({
  children,
  siteObject, // <object> utilityObject.js's "acknowledgmentsSites" and "socialMediaSites"
  site, // <string> siteObject's key
  tabIndex, // <number> necessary to handle tabbing and triggering blur
  expIconSFX, // <object> useAudio() SFX object to add to icon click
  classNames = {} // <object> classNames object. Check propTypes below for its constitution
}) {
  // state and toggler to handle icon displaying its contents
  const [showDetails, toggleShowDetails] = useToggle(false)

  const handleIconClick = useCallback(
    (e) => {
      // do not propagate the click, play the SFX if we are opening the
      // contents, and toggle the state to opened/closed
      e.stopPropagation()
      if (expIconSFX && !showDetails) expIconSFX.restart()
      toggleShowDetails()
    },
    [toggleShowDetails, showDetails]
  )

  return (
    <div
      className={classes.container(
        showDetails,
        classNames.container,
        classNames.expandContainer
      )}
      tabIndex={tabIndex}
      onClick={showDetails ? null : toggleShowDetails}
      onBlur={showDetails ? toggleShowDetails : null}
    >
      <img
        src={siteObject[site].src} // coming from utilityObjects sites configs
        alt={siteObject[site].alt} // same
        onClick={handleIconClick}
        className={classes.icon(showDetails, classNames.icon)}
        role="button"
        aria-expanded={showDetails}
      />
      <div className={classes.content(showDetails, classNames.content)}>
        {showDetails && children}
      </div>
    </div>
  )
}

ExpandableIcon.propTypes = {
  children: PropTypes.node.isRequired,
  siteObject: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    divContent: PropTypes.node
  }).isRequired,
  site: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  expIconSFX: PropTypes.object,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.arrayOf(PropTypes.string),
    icon: PropTypes.arrayOf(PropTypes.string),
    expandContainer: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(ExpandableIcon)
