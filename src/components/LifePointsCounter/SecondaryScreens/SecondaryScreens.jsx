import React, { useCallback } from "react"
import PropTypes from "prop-types"
import useAudio from "../../../hooks/useAudio"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import SecondaryScreen from "../../UI/SecondaryScreen/SecondaryScreen"
import DiceScreen from "../DiceScreen/DiceScreen"
import CoinScreen from "../CoinScreen/CoinScreen"
import TokenScreen from "../TokenScreen/TokenScreen"
import TimerScreen from "../TimerScreen/TimerScreen"
import RestartConfirmScreen from "../RestartConfirmScreen/RestartConfirmScreen"
import clickOKmp3 from "../../../assets/audios/clickOK.mp3"
import clickCancelmp3 from "../../../assets/audios/clickCancel.mp3"
import uiConfigs from "../../../utils/ui.configs.json"

export default function SecondaryScreens({
  secondScreenType, // <string> UIContext Secondary Screen toggler types
  secondScreenState, // <boolean> UIContext Secondary Screen toggled state
  toggleSecondScreen, // <function> secondary screen toggler
  dispatchToastAction, // <function> toast reducer action dispatcher
  switchSFX, // <object> switch sound effect audio controls
  modalSFX, // <object> modal sound effect audio controls
  playSFXs // <boolean> universal sound effect's ON/OFF state
}) {
  const togglers = uiConfigs.togglers.secondaryScreens
  // one toggler should be on at a time, all others off. This triggers the
  // respective second screen to open
  const isDiceSecondScreen = secondScreenType === togglers.die
  const isCoinSecondScreen = secondScreenType === togglers.coin
  const isTokenSecondScreen = secondScreenType === togglers.token
  const isTimerSecondScreen = secondScreenType === togglers.timer
  const isRestartSecondScreen =
    secondScreenType === togglers.restartDuel ||
    secondScreenType === togglers.confirmRestartDuel
  // sound effect to play on "confirm" or "OK"
  const [clickOKAudioJSX, clickOKSFX] = useAudio(clickOKmp3, {
    toggleOn: playSFXs
  })
  // sound effect to play on "cancel"
  const [clickCancelAudioJSX, clickCancelSFX] = useAudio(clickCancelmp3, {
    toggleOn: playSFXs
  })
  // all screens rendered by SecondaryScreen need sound effect objects and
  // toast action dispatcher, so construct an object and pass it to them
  const props = {
    switchSFX,
    clickOKSFX,
    clickCancelSFX,
    playSFXs,
    dispatchToastAction
  }

  const handleToggleToast = useCallback(() => {
    // toast toggler action dispatcher to assign to "X" (close button)
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  return (
    <>
      {secondScreenState && (
        <>
          <SecondaryScreen
            toggle={toggleSecondScreen}
            animation="scale"
            sfxObj={modalSFX}
            small={isRestartSecondScreen}
            onClose={handleToggleToast}
          >
            {isDiceSecondScreen && <DiceScreen {...props} />}
            {isCoinSecondScreen && <CoinScreen {...props} />}
            {isTokenSecondScreen && <TokenScreen {...props} />}
            {isTimerSecondScreen && <TimerScreen {...props} />}
            {isRestartSecondScreen && (
              <RestartConfirmScreen
                toggleSecondScreen={toggleSecondScreen}
                confirm={secondScreenType === togglers.confirmRestartDuel}
              />
            )}
          </SecondaryScreen>
          {clickOKAudioJSX}
          {clickCancelAudioJSX}
        </>
      )}
    </>
  )
}

SecondaryScreens.propTypes = {
  secondScreenType: PropTypes.string.isRequired,
  secondScreenState: PropTypes.bool.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  switchSFX: PropTypes.object.isRequired,
  modalSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
