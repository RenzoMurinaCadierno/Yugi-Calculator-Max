import React, { useMemo } from "react"
import PropTypes from "prop-types"
import SelectionMenuScreen from "../../UI/SelectionMenuScreen/SelectionMenuScreen"
import { classes, getSelectionMenuEntries } from "./HelpSection.utils"

export default function HelpSection({
  playSFXs // <boolean> global ON/OFF state for sound effects, from UIContext
}) {
  // getHelpSelectionMenuItems() creates a valid object to render <SelectionMenuScreen />
  // We memoize the function as it is costly. We pass lots of extra components which
  // do not change in time, so it is safe to apply memoization
  const helpSelectionMenuItems = useMemo(() => getSelectionMenuEntries(), [])

  return (
    <SelectionMenuScreen
      items={helpSelectionMenuItems}
      playSFXs={playSFXs}
      classNames={classes.selectionMenu}
    />
  )
}

HelpSection.propTypes = {
  playSFXs: PropTypes.bool.isRequired
}
