import React, { useContext, useEffect } from "react"
import PropTypes from "prop-types"
import { LogContext } from "../../contexts/LogContext"
import SecondaryScreen from "../../components/UI/SecondaryScreen/SecondaryScreen"
import LogMenu from "../../components/Log/LogMenu/LogMenu"
import LogScreen from "../../components/Log/LogScreen/LogScreen"
import LogDeleteScreen from "../../components/Log/LogDeleteScreen/LogDeleteScreen"
import uiConfigs from "../../utils/ui.configs.json"
import styles from "./LogPage.module.css"

export default function LogPage({
  toggleSecondScreen, // <function> UIContext's secondary screen toggler
  secondScreenState, // <boolean> UIContext's secondary screen state
  secondScreenType, // <string> UIContext's secondary screen type
  modalSFX, // <object> useAudio()'s controls for secondary screen toggling sfx
  playSFXs // <boolean> global ON/OFF sfx switch
}) {
  // grab everything needed from LogContext
  const {
    logPageState,
    filterLogs,
    deleteLSLogHistory,
    mountLogs
  } = useContext(LogContext)
  // at mount phase, load logs from local storage and set them in reducer
  useEffect(mountLogs, [])

  return (
    <>
      {
        // only mount <SecondaryScreen /> if "Delete" log option was selected
        // (represented by deleteLogs toggler set in secondScreenType)
        secondScreenType === uiConfigs.togglers.secondaryScreens.deleteLogs &&
          secondScreenState && (
            <SecondaryScreen
              toggle={toggleSecondScreen}
              small
              animation="scale"
              sfxObj={modalSFX}
            >
              <LogDeleteScreen
                toggleSecondScreen={toggleSecondScreen}
                deleteLSLogHistory={deleteLSLogHistory}
              />
            </SecondaryScreen>
          )
      }
      <main className={styles.Container}>
        <LogScreen logs={logPageState.logs} filterLogs={filterLogs} />
        <LogMenu
          filterLogs={filterLogs}
          logPageState={logPageState}
          toggleSecondScreen={toggleSecondScreen}
          playSFXs={playSFXs}
        />
      </main>
    </>
  )
}

LogPage.propTypes = {
  secondScreenType: PropTypes.string.isRequired,
  secondScreenState: PropTypes.bool.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  modalSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
