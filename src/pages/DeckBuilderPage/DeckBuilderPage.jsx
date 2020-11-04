import React, { useContext, useEffect } from "react"
import PropTypes from "prop-types"
import useAudio from "../../hooks/useAudio"
import { MediaQuery } from "../../contexts/MediaQueryContext"
import SecondaryScreens from "../../components/DeckBuilder/SecondaryScreens/SecondaryScreens"
import HalfScreenDivision from "../../wrappers/HalfScreenDivision/HalfScreenDivision"
import DeckCreatorScreen from "../../components/DeckBuilder/DeckCreatorScreen/DeckCreatorScreen"
import CardListOrStatsScreen from "../../components/DeckBuilder/CardListOrStatsScreen/CardListOrStatsScreen"
import switchmp3 from "../../assets/audios/switch.mp3"
import clickOKmp3 from "../../assets/audios/clickOK.mp3"
import toastmp3 from "../../assets/audios/toast.mp3"
import uiConfigs from "../../utils/ui.configs.json"
import styles from "./DeckBuilderPage.module.css"

export default function DeckBuilderPage({
  playSFXs, // <boolean> global ON/OFF sfx switch
  swipe, // <function> App.js swipe handler
  toastState, // <oblject> UIContext's <Toast /> reducer state
  ...otherProps // all other UIContext props (check propTypes below for them)
}) {
  // Screen division components will adjust styles depending on device's orientation
  const { mq } = useContext(MediaQuery)
  // audio JSX and controls object for <SecondaryScreens />'s "success" sfx
  const [switchAudioJSX, switchSFX] = useAudio(switchmp3, {
    toggleOn: playSFXs
  })
  // audio JSX and controls object for <SecondaryScreens />'s "confirm" sfx
  const [clickOKAudioJSX, clickOKSFX] = useAudio(clickOKmp3, {
    toggleOn: playSFXs
  })
  // audio JSX and controls object for toast trigger sfx
  const [toastAudioJSX, toastSFX] = useAudio(toastmp3, {
    toggleOn: playSFXs,
    playbackRate: 1.2
  })

  useEffect(() => {
    // play <Toast /> SFX each time toast opens, except when adding or
    // saving a deck, as both have a "success" sfx assigned on their place
    toastState.isActive &&
      toastState.type !== uiConfigs.togglers.toast.addDeck &&
      toastState.type !== uiConfigs.togglers.toast.saveDeck &&
      toastSFX.play()
  }, [toastState.isActive])

  return (
    <>
      <SecondaryScreens
        playSFXs={playSFXs}
        swipe={swipe}
        switchSFX={switchSFX}
        clickOKSFX={clickOKSFX}
        toastState={toastState}
        {...otherProps}
      />
      <main className={styles.Container}>
        <HalfScreenDivision
          ariaLabel="Deck construction area"
          width={mq.portrait ? 98 : 61}
          height={mq.portrait ? 63 : 100}
          component="section"
        >
          <DeckCreatorScreen playSFXs={playSFXs} />
        </HalfScreenDivision>
        <HalfScreenDivision
          ariaLabel="Card list area"
          width={mq.portrait ? 98 : 37}
          height={mq.portrait ? 37 : 100}
          component="section"
        >
          <CardListOrStatsScreen />
        </HalfScreenDivision>
      </main>
      {switchAudioJSX}
      {clickOKAudioJSX}
      {toastAudioJSX}
    </>
  )
}

DeckBuilderPage.propTypes = {
  secondScreenState: PropTypes.bool.isRequired,
  secondScreenType: PropTypes.string.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  screenIsFrozen: PropTypes.bool.isRequired,
  setScreenIsFrozen: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  modalSFX: PropTypes.object.isRequired,
  swipe: PropTypes.func.isRequired
}
