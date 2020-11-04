import React, { useState, useEffect, useContext, useRef } from "react"
import PropTypes from "prop-types"
import { CSSTransition } from "react-transition-group"
import { roll } from "../../../utils/utilityFunctions"
import { PlayerContext } from "../../../contexts/PlayerContext"
import { TimerContext } from "../../../contexts/TimerContext"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as diceActionCreators from "../../../store/CoinDieToken/coinDieTokenActionCreators"
import uiConfigs from "../../../utils/ui.configs.json"
import styles from "./Die.module.css"

export default function Die({
  item = {}, // <object> "dice" reducer object in state {id: '', res: ''}
  diceDispatch, // <function> dice reducer's action dispatcher
  logDispatch, // <function> coinLog reducer's action dispatcher
  playerConfigs = {}, // <object> "playerConfigs" object inside "configs" local storage key
  diceSFX, // <object> useAudio()'s controls object for die roll SFX
  classNames = [] // <Array> array of className strings
}) {
  const { currentPlayer, playerNames } = useContext(PlayerContext)
  const { isTimerRunning, timerObject } = useContext(TimerContext)
  // state controller for CSSTransition
  const [isRolling, setIsRolling] = useState(false)
  // isMounting will stop useEffect to trigger on mount
  const isMounting = useRef(true)
  // if the player configged min and max limits, they should appear on
  // LocalStorage object, so use them. Otherwise, use the default ones
  const { minRoll, maxRoll } = playerConfigs.hasOwnProperty("diceConfig")
    ? playerConfigs["diceConfig"]
    : uiConfigs.diceConfig
  // classNames arrays
  const classes = [styles.Container]
  // push classes coming from props to their respective arrays
  classNames.forEach((c) => classes.push(c))

  const performRoll = () => {
    // play the roll sfx and toggle roll state if it is off.
    // That will replay die roll CSSAnimation
    diceSFX.restart()
    !isRolling && setIsRolling(true)
  }

  useEffect(() => {
    let rollTimer
    // do nothing on mount or if die state is false (not rolling)
    if (isMounting.current || !isRolling) isMounting.current = false
    else {
      // when performRoll function changes state to true, trigger a timeout
      rollTimer = setTimeout(() => {
        // calculate roll result
        const rollResult = roll(1, minRoll, maxRoll)
        // modify dice array to show the proper result on the rolled dice
        diceDispatch(
          diceActionCreators.modifyArray({ id: item.id, res: rollResult })
        )
        // if logDispatch action dispatch is defined, log the roll
        logDispatch &&
          logDispatch(
            logActionCreators.log({
              type: uiConfigs.logTypes.dice,
              text: `${playerNames[currentPlayer]} rolled ${rollResult}`,
              timer: isTimerRunning
                ? `${timerObject.hs}:${timerObject.mins}:${timerObject.secs}`
                : "",
              logPing: Math.random()
            })
          )
        // reset rolling state so that die can be rolled again
        setIsRolling(false)
      }, uiConfigs.timeouts.diceRollAnimation)
    }
    // clear timeout on unmount to avoid memory leaks
    return () => rollTimer && clearTimeout(rollTimer)
  }, [isRolling, item.id, diceDispatch, currentPlayer, logDispatch])

  return (
    <CSSTransition
      in={isRolling}
      timeout={uiConfigs.timeouts.diceRollAnimation}
      classNames="spin"
    >
      <div
        className={classes.join(" ")}
        onClick={performRoll}
        aria-label={`Click to roll. Current roll: ${
          item.res[0] || "not rolled"
        }`}
      >
        {item.res}
      </div>
    </CSSTransition>
  )
}

Die.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    res: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  diceDispatch: PropTypes.func.isRequired,
  logDispatch: PropTypes.func,
  playerConfigs: PropTypes.shape({
    minRoll: PropTypes.number,
    maxRoll: PropTypes.number
  }),
  diceSFX: PropTypes.object.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string)
}
