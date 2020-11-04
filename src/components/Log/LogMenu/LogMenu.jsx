import React, { useCallback } from "react"
import PropTypes from "prop-types"
import useAudio from "../../../hooks/useAudio"
import SVGImage from "../../UI/SVGImage/SVGImage"
import uiConfigs from "../../../utils/ui.configs.json"
import switchmp3 from "../../../assets/audios/switch.mp3"
import trash from "../../../assets/uiIcons/trash.svg"
import { classes, getLogFilterSVGImg } from "./LogMenu.utils"
import styles from "./LogMenu.module.css"

export default function LogMenu({
  filterLogs, // <function> log reducer's action to filter logs (in LogContext)
  logPageState: { activeIcon }, // <string> logPage reducer's "activeIcon" value
  toggleSecondScreen, // <function> <SecondaryScreen /> toggler
  playSFXs // <boolean> global ON/OFF switch state for audios
}) {
  // audio JSX and controls object for log filtering icons' SFX
  const [switchAudioSFX, switchSFX] = useAudio(switchmp3, {
    toggleOn: playSFXs
  })

  const handleFilterLogs = useCallback(
    (e) => {
      // on an icon click different to the active one, play the SFX and
      // dispatch log action to filter by the respective icon type
      if (activeIcon !== e.target.dataset.id) {
        switchSFX.play()
        filterLogs(e.target.dataset.id)
      }
    },
    [filterLogs, activeIcon, switchSFX]
  )

  const handleToggleSecondScreen = useCallback(
    (e) => {
      // data-id of each SVGImage contains its respective log type string
      toggleSecondScreen(e.target.dataset.id)
    },
    [toggleSecondScreen]
  )

  return (
    <section className={styles.Container}>
      <div
        className={classes.allLogs(activeIcon)}
        aria-label="Show all logs"
        role="button"
        aria-pressed={activeIcon === "all"}
        onClick={handleFilterLogs}
        data-id="all"
      >
        ALL
      </div>
      {getLogFilterSVGImg("lp", activeIcon, handleFilterLogs)}
      {getLogFilterSVGImg("dice", activeIcon, handleFilterLogs)}
      {getLogFilterSVGImg("coin", activeIcon, handleFilterLogs)}
      {getLogFilterSVGImg("timer", activeIcon, handleFilterLogs)}
      <SVGImage
        src={trash}
        alt="Delete all logs"
        type="secondary"
        role="button"
        onClick={handleToggleSecondScreen}
        dataId={uiConfigs.togglers.secondaryScreens.deleteLogs}
        classNames={classes.trash}
      />
      {switchAudioSFX}
    </section>
  )
}

LogMenu.propTypes = {
  filterLogs: PropTypes.func.isRequired,
  logPageState: PropTypes.shape({
    logs: PropTypes.arrayOf(PropTypes.object),
    cache: PropTypes.arrayOf(PropTypes.object),
    activeIcon: PropTypes.string
  }).isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
