import React, { useEffect } from "react"
import PropTypes from "prop-types"
import useAudio from "../../hooks/useAudio"
import SecondaryScreens from "../../components/Options/SecondaryScreens/SecondaryScreens"
import Configs from "../../components/Options/Configs/Configs"
import Credits from "../../components/Options/Credits/Credits"
import { secondaryScreensData } from "../../utils/utilityObjects"
import toastmp3 from "../../assets/audios/toast.mp3"
import styles from "./OptionsPage.module.css"

// construct an array of "Credits" object's keys and values as entries.
// They will be mapped as <SelectionMenuScreen /> titles and content in
// <SecondaryScreens />, and as children of <Credits />'s <Card />s
const creditsScreens = Object.entries(secondaryScreensData.credits)

export default function OptionsPage({
  toggleSecondScreen, // <function> UIContext's Secondary Screen toggler
  secondScreenState, // <boolean> UIContext's Secondary Screen state
  secondScreenType, // <boolean> UIContext's Secondary Screen type
  toastState, // <object> UIContext's toast reducer state
  dispatchToastAction, // <function> UIContext's toast reducer action dispatcher
  playSFXs, // <boolean> UIContext's universal ON/OFF sfx switch
  togglePlaySFXs, // <function> UIContext's playSFXs toggler
  modalSFX // <object> useAudio()'s modal SFX controls object
}) {
  // useAudio JSX and controls object for <Toast /> sfx
  const [toastAudioJSX, toastSFX] = useAudio(toastmp3, {
    toggleOn: playSFXs,
    playbackRate: 1.2
  })

  useEffect(() => {
    // is <Toast /> becomes active, play its SFX only if a <SecondaryScreen />
    // is also active. This is such because the only instances where <Toast />
    // triggers while not in a <SecondaryScreen /> is when toggling log/SFX switches.
    // They have their own SFX for <Toast />, so block this one to avoid collision.
    if (toastState.isActive && secondScreenState) toastSFX.restart()
  }, [toastState.isActive])

  return (
    <>
      <main className={styles.Container}>
        <Configs
          playSFXs={playSFXs}
          togglePlaySFXs={togglePlaySFXs}
          toggleSecondScreen={toggleSecondScreen}
          modalSFX={modalSFX}
        />
        <Credits
          toggleSecondScreen={toggleSecondScreen}
          creditsScreens={creditsScreens}
        />
      </main>
      <SecondaryScreens
        creditsScreens={creditsScreens}
        toggleSecondScreen={toggleSecondScreen}
        secondScreenState={secondScreenState}
        secondScreenType={secondScreenType}
        toastState={toastState}
        dispatchToastAction={dispatchToastAction}
        playSFXs={playSFXs}
        modalSFX={modalSFX}
        toastSFX={toastSFX}
      />
      {toastAudioJSX}
    </>
  )
}

OptionsPage.propTypes = {
  secondScreenState: PropTypes.bool.isRequired,
  secondScreenType: PropTypes.string.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  togglePlaySFXs: PropTypes.func.isRequired,
  modalSFX: PropTypes.object.isRequired
}
