import React, { useState, useCallback } from "react"
import PropTypes from "prop-types"
import { useSwipeable } from "react-swipeable"
import useAudio from "../../hooks/useAudio"
import SecondaryScreens from "../../components/LifePointsCounter/SecondaryScreens/SecondaryScreens"
import MiniCircle from "../../components/UI/MiniCircle/MiniCircle"
import Lifepoints from "../../components/LifePointsCounter/LifePoints/LifePoints"
import Calculator from "../../components/LifePointsCounter/Calculator/Calculator"
import switchmp3 from "../../assets/audios/switch.mp3"
import toggleCalcmp3 from "../../assets/audios/switchTitles.mp3"
import calculatorSVG from "../../assets/uiIcons/calculator.svg"
import { classes, swipeHandlers } from "./LifePointsCounterPage.utils"
import styles from "./LifePointsCounterPage.module.css"

export default function LifePointsCounterPage({
  toggleSecondScreen, // <function> UIContext's secondary screen toggler
  secondScreenState, // <boolean> UIContext's secondary screen state
  secondScreenType, // <string> UIContext's secondary screen type
  setScreenIsFrozen, // <function> UIContext's swipe-freezing toggler
  dispatchToastAction, // <function> UIContext's <Toast /> action dispatcher
  playSFXs, // <boolean> global ON/OFF sfx switch
  modalSFX // <object> useAudio()'s controls for secondary screen toggling sfx
}) {
  // audio JSX and controls object for log toggling SFX
  const [switchAudioJSX, switchSFX] = useAudio(switchmp3, {
    toggleOn: playSFXs
  })
  // audio JSX and controls object for calculator toggling SFX
  const [toggleCalcAudioJSX, toggleCalcSFX] = useAudio(toggleCalcmp3, {
    toggleOn: playSFXs,
    playbackRate: 1.2
  })
  // boolean and setter to toggle calculator buttons on/off
  const [showCalcButtons, setShowCalcButtons] = useState(true)

  const toggleCalcButtons = useCallback(() => {
    // play toggling sfx on calculator showCalcButtons and toggle showCalcButtons state
    toggleCalcSFX.play()
    setShowCalcButtons((prevState) => !prevState)
  }, [setShowCalcButtons, toggleCalcSFX])
  // useSwipeable()'s up + down swipe handlers to spread on visible area
  const swipeUpDownHandlers = useSwipeable(swipeHandlers(toggleCalcButtons))

  return (
    <>
      <SecondaryScreens
        toggleSecondScreen={toggleSecondScreen}
        secondScreenState={secondScreenState}
        secondScreenType={secondScreenType}
        dispatchToastAction={dispatchToastAction}
        switchSFX={switchSFX}
        modalSFX={modalSFX}
        playSFXs={playSFXs}
      />
      <main {...swipeUpDownHandlers} className={styles.Container}>
        <MiniCircle
          display={
            <img
              src={calculatorSVG}
              alt="toggle calculator"
              className={styles.CalculatorImage}
            />
          }
          role="button"
          ariaPressed={showCalcButtons}
          animateOnClick
          onClick={toggleCalcButtons}
          classNames={classes.miniCircle(showCalcButtons)}
        />
        <Lifepoints
          isExpanded={!showCalcButtons}
          playSFXs={playSFXs}
          setScreenIsFrozen={setScreenIsFrozen}
          dispatchToastAction={dispatchToastAction}
        />
        <Calculator showCalcButtons={showCalcButtons} switchSFX={switchSFX} />
      </main>
      {switchAudioJSX}
      {toggleCalcAudioJSX}
    </>
  )
}

LifePointsCounterPage.propTypes = {
  secondScreenState: PropTypes.bool.isRequired,
  secondScreenType: PropTypes.string.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  setScreenIsFrozen: PropTypes.func.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  modalSFX: PropTypes.object.isRequired
}
