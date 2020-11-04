import React, { useState, useEffect, useContext, useRef } from "react"
import PropTypes from "prop-types"
import { CSSTransition } from "react-transition-group"
import { PlayerContext } from "../../../contexts/PlayerContext"
import { TimerContext } from "../../../contexts/TimerContext"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as coinActionCreators from "../../../store/CoinDieToken/coinDieTokenActionCreators"
import uiConfigs from "../../../utils/ui.configs.json"
import tick from "../../../assets/uiIcons/tick.svg"
import cross from "../../../assets/uiIcons/cross.svg"
import styles from "./Coin.module.css"

export default function Coin({
  item, // <object> "coin" reducer object in state {id: '', res: '', alt: ''}
  coinDispatch, // <function> coin reducer's action dispatcher
  logDispatch, // <function> coinLog reducer's action dispatcher
  coinSFX // <object> useAudio()'s controls object for coin toss SFX
}) {
  // we need the current player's key and name, as well as timer object and
  // timer running state to log coin tosses. Grab them from context
  const { currentPlayer, playerNames } = useContext(PlayerContext)
  const { isTimerRunning, timerObject } = useContext(TimerContext)
  // state controller for CSSTransition
  const [isTossing, setIsTossing] = useState(false)
  // isMounting will stop useEffect to trigger on mount
  const isMounting = useRef(true)

  const performToss = () => {
    // play the toss sfx and toggle toss state if it is off.
    // That will replay coin roll CSSAnimation
    coinSFX.restart()
    !isTossing && setIsTossing(true)
  }

  useEffect(() => {
    let tossTimer
    // do nothing on mount or if coin state is false (not tossing)
    if (isMounting.current || !isTossing) isMounting.current = false
    else {
      // when performToss function changes state to true, trigger a timeout
      tossTimer = setTimeout(() => {
        // calculate flip result
        const flipResult =
          Math.random() > 0.5
            ? { res: tick, alt: "Heads" }
            : { res: cross, alt: "Tails" }
        // modify coin array to show the proper result on the tossed coin
        coinDispatch(
          coinActionCreators.modifyArray({
            id: item.id,
            res: flipResult.res,
            alt: flipResult.alt
          })
        )
        // log the roll
        logDispatch(
          logActionCreators.log({
            type: uiConfigs.logTypes.coin,
            text: `${playerNames[currentPlayer]} flipped ${flipResult.alt}`,
            timer: isTimerRunning
              ? `${timerObject.hs}:${timerObject.mins}:${timerObject.secs}`
              : "",
            logPing: Math.random()
          })
        )
        // reset tossing state so that coin can be tossed again
        setIsTossing(false)
      }, uiConfigs.timeouts.coinTossAnimation)
    }
    // clear timeout on unmount to avoid memory leaks
    return () => tossTimer && clearTimeout(tossTimer)
  }, [isTossing, item.id, coinDispatch, currentPlayer, logDispatch])

  return (
    <CSSTransition
      in={isTossing}
      timeout={uiConfigs.timeouts.coinTossAnimation}
      classNames="flip"
    >
      <div
        className={styles.Container}
        onClick={performToss}
        aria-label={`Click to flip. Current flip: ${item.alt || "not flipped"}`}
      >
        {item.res && (
          <img src={item.res} alt={item.alt} className={styles.Result} />
        )}
      </div>
    </CSSTransition>
  )
}

Coin.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    res: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired
  }).isRequired,
  coinDispatch: PropTypes.func.isRequired,
  logDispatch: PropTypes.func.isRequired,
  coinSFX: PropTypes.object.isRequired
}
