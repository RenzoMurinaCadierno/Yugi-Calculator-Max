import React, { useContext, memo } from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import { UIContext } from "../../../contexts/UIContext"
import useAudio from "../../../hooks/useAudio"
import UICardContainer from "../../../wrappers/UICardContainer/UICardContainer"
import OptionTitle from "../../../wrappers/OptionTitle/OptionTitle"
import OptionBody from "../../../wrappers/OptionBody/OptionBody"
import LogSwitches from "../LogSwitches/LogSwitches"
import SFXSwitch from "../SFXSwitch/SFXSwitch"
import switchmp3 from "../../../assets/audios/switch.mp3"
// import styles from "./Switches.module.css"

function Switches({ playSFXs, togglePlaySFXs }) {
  // switches will fire <Toast />s when toggling, so bring reducer state
  // and action dispatcher for them, from UIContext
  const { toastState, dispatchToastAction } = useContext(UIContext)
  // also, SFX switch's "width" prop adapts to media query, so we use that
  // state from context too
  const { mq } = useContext(MediaQuery)
  // audio JSX and controls object for log and SFX toggle SFX
  const [switchAudioJSX, switchSFX] = useAudio(switchmp3, {
    toggleOn: playSFXs
  })

  return (
    <UICardContainer>
      <OptionTitle> Log/SFX switches </OptionTitle>
      <OptionBody>
        <LogSwitches
          width={70}
          switchSFX={switchSFX}
          toastState={toastState}
          dispatchToastAction={dispatchToastAction}
        />
        <SFXSwitch
          width={mq.portrait ? 30 : 20}
          switchSFX={switchSFX}
          playSFXs={playSFXs}
          togglePlaySFXs={togglePlaySFXs}
          toastState={toastState}
          dispatchToastAction={dispatchToastAction}
        />
      </OptionBody>
      {switchAudioJSX}
    </UICardContainer>
  )
}

Switches.propTypes = {
  playSFXs: PropTypes.bool.isRequired,
  togglePlaySFXs: PropTypes.func.isRequired
}

export default memo(Switches)
