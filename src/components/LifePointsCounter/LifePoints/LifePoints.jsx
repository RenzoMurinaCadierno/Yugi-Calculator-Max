import React, {
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect
} from "react"
import PropTypes from "prop-types"
import { LPContext } from "../../../contexts/LPContext"
import { PlayerContext } from "../../../contexts/PlayerContext"
import { LocalStorageContext } from "../../../contexts/LocalStorageContext"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import useAudio from "../../../hooks/useAudio"
import useLifePointsAudio from "../../../hooks/useLifePointsAudio"
import LifePointsGauge from "../LifePointsGauge/LifePointsGauge"
import lpmp3 from "../../../assets/audios/lifepoints.mp3"
import switchTitlesmp3 from "../../../assets/audios/switchTitles.mp3"
import clickOKmp3 from "../../../assets/audios/clickOK.mp3"
import clickCancelmp3 from "../../../assets/audios/clickCancel.mp3"
import { getPlayerNameWarning } from "../../../utils/utilityFunctions"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./LifePoints.utils"
import styles from "./LifePoints.module.css"

export default function Lifepoints({
  isExpanded, // <boolean> on true, calculator buttons were hidden. View should change accordingly
  playSFXs, // <boolean> universal sound effect's ON/OFF state
  setScreenIsFrozen, // <function> screen freezing toggler
  dispatchToastAction // <function> toast reducer action dispatcher
}) {
  const { lpState } = useContext(LPContext)
  const {
    currentPlayer,
    toggleCurrentPlayer,
    playerNames,
    setPlayerNames
  } = useContext(PlayerContext)
  const { getLSasJSObject } = useContext(LocalStorageContext)
  // isMouting will stop SFXs from playing on mount
  const isMounting = useRef(true)
  // max Lifepoints reference to get the progressbar value inside LifePointsGauge
  const [maxLP, setMaxLP] = useState({ p1: 0, p2: 0 })
  // use useLifePointsAudio to get the correct lifepoint end animation audio sfx
  const { lpChangemp3, lpChangeGameEndmp3 } = useLifePointsAudio()
  // sound effect that plays when lifepoints are being modified
  // (the "ding ding ding ding ding")
  const [lpAudioJSX, lpSFX] = useAudio(lpmp3, {
    toggleOn: playSFXs
  })
  // sound effect to toggle between LifePointGauges
  const [toggleAudioJSX, toggleSFX] = useAudio(switchTitlesmp3, {
    toggleOn: playSFXs,
    playbackRate: 1.3
  })
  // sound effect that plays after the first lifepoints modification sfx.
  // (after the "ding ding ding ding ding")
  const [lpAnimationEndAudioJSX, lpAnimationEndSFX] = useAudio(lpChangemp3, {
    toggleOn: playSFXs,
    playbackRate: 1.1,
    sources: [lpChangemp3, lpChangeGameEndmp3]
  })
  // sound effects for a successful/failed name change attempt
  const [nameChangeAudioJSX, nameChangeSFX] = useAudio(lpChangemp3, {
    toggleOn: playSFXs,
    playbackRate: 1.5,
    sources: [clickOKmp3, clickCancelmp3]
  })

  // when clicking in each players' lifepoints gauges, switch them if they
  // are different. Play the toggling SFX if so, too
  const togglePlayer = useCallback(
    (e) => {
      if (e.target.dataset.id && e.target.dataset.id !== currentPlayer) {
        toggleSFX.restart()
        toggleCurrentPlayer()
      }
    },
    [currentPlayer, toggleSFX, toggleCurrentPlayer]
  )

  // we want no decimals in lifepoints' Animated Numbers
  const formatValue = useCallback((value) => value.toFixed(0), [])

  const setLPChangeSFXandFreezeScreen = useCallback(
    (currentPlayerLP) => {
      // To avoid memory leaks when unmounting the component, we freeze the screen
      // when the animation is playing.
      // If any player's lifepoints hit 0, the sound effect toggles to the second
      // track. Otherwise, we set it to the first one
      setScreenIsFrozen(true)
      if (!currentPlayerLP) lpAnimationEndSFX.setNextSrc(1)
      else lpAnimationEndSFX.setNextSrc(0)
    },
    [setScreenIsFrozen]
  )

  const playLPSFXAndUnfreezeScreen = useCallback(() => {
    // we add the extra check here since we cannot stop this effect from playing
    // at mount. isMounting would be set to false by then due to useEffect above.
    // LifePoints will be frozen at mount, this AnimatedNumber will not play (first
    // prevention). playSFXs will be set to false if Sound effects are off, so it
    // will not play after mount either (second prevention)
    if (playSFXs) lpAnimationEndSFX.play()
    setScreenIsFrozen(false)
  }, [lpAnimationEndSFX, setScreenIsFrozen])

  // grab player configged lifepoints limits from LocalStorage, or set the default
  // ones if there are none. Since this one is the landing page, set its title.
  useEffect(() => {
    const {
      playerConfigs: { initialLifePoints }
    } = getLSasJSObject()
    setMaxLP(!!initialLifePoints ? initialLifePoints : uiConfigs.initialLP)
    document.title = uiConfigs.documentTitle
  }, [getLSasJSObject])

  useEffect(() => {
    // it might happen that downwards components trigger an error while setting
    // any player name tags. To deal with this issue before the reducer sets
    // the name, we can use a Toast to show a warning to the user
    if (!isMounting.current && playerNames && playerNames[currentPlayer]) {
      const toastText = getPlayerNameWarning(playerNames[currentPlayer])
      toastText &&
        dispatchToastAction(
          toastActionCreators.setToastState(
            toastText,
            null,
            uiConfigs.togglers.toast.logSwitches
          )
        )
    }
  }, [playerNames])

  useEffect(() => {
    // we do not play lifepoint's inc/dec sound effect on mount, but we do so
    // at any other time they change. If the user repeatedly clicks to affect
    // them when the animation is still playing, then just replay the sound
    // instantly (force stop the previous one, play the next one)
    if (isMounting.current) isMounting.current = false
    else lpSFX.restart()
  }, [lpState.p1, lpState.p2])

  return (
    <section className={classes.container(isExpanded)}>
      <LifePointsGauge
        dataId="p1"
        isActive={currentPlayer === "p1"}
        animatedNumber={{
          value: lpState.p1,
          formatValue,
          duration: uiConfigs.timeouts.animatedNumber,
          begin: () => setLPChangeSFXandFreezeScreen(lpState.p1),
          complete: playLPSFXAndUnfreezeScreen
        }}
        maxLP={maxLP.p1}
        ariaLabel="Player 1 lifepoints"
        role="button"
        nameChangeSFX={nameChangeSFX}
        onClick={togglePlayer}
        playerName={playerNames.p1}
        setPlayerNames={setPlayerNames}
        classNames={classes.p1LPGauge(isExpanded)}
      />
      {!isExpanded && (
        <div aria-label="Operation display" className={styles.LPCalcContainer}>
          {lpState.tempLP}
        </div>
      )}

      <LifePointsGauge
        dataId="p2"
        isActive={currentPlayer === "p2"}
        animatedNumber={{
          value: lpState.p2,
          formatValue,
          duration: uiConfigs.timeouts.animatedNumber,
          begin: () => setLPChangeSFXandFreezeScreen(lpState.p2),
          complete: playLPSFXAndUnfreezeScreen
        }}
        maxLP={maxLP.p2}
        ariaLabel="Player 2 lifepoints"
        role="button"
        nameChangeSFX={nameChangeSFX}
        playerName={playerNames.p2}
        setPlayerNames={setPlayerNames}
        onClick={togglePlayer}
        classNames={classes.p2LPGauge(isExpanded)}
      />
      {lpAudioJSX}
      {lpAnimationEndAudioJSX}
      {toggleAudioJSX}
      {nameChangeAudioJSX}
    </section>
  )
}

Lifepoints.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  setScreenIsFrozen: PropTypes.func.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}
