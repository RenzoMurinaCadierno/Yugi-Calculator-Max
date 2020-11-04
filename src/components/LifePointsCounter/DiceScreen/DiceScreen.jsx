import React, { useContext, useEffect, useRef, useCallback } from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { CoinDieTokenContext } from "../../../contexts/CoinDieTokenContext"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import { LocalStorageContext } from "../../../contexts/LocalStorageContext"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as diceActionCreators from "../../../store/CoinDieToken/coinDieTokenActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import useAudio from "../../../hooks/useAudio"
import useReRender from "../../../hooks/useReRender"
import CoinDieTokenBottomScreen from "../../../wrappers/CoinDieTokenBottomScreen/CoinDieTokenBottomScreen"
import CoinDieTokenTopScreen from "../../../wrappers/CoinDieTokenTopScreen/CoinDieTokenTopScreen"
import Die from "../Die/Die"
import Button from "../../UI/Button/Button"
import dicemp3 from "../../../assets/audios/dice.mp3"
import { classes } from "./DiceScreen.utils"
import styles from "./DiceScreen.module.css"

export default function DiceScreen({
  switchSFX, // <object> useAudio() controls object for BottomScreen's log button
  clickOKSFX, // <object> useAudio() controls object for BottomScreen's - button
  clickCancelSFX, // <object> useAudio() controls object for BottomScreen's + button
  playSFXs, // <boolean> global state to control SFXs, coming from UIContext
  dispatchToastAction // <function> <Toast /> action dispatcher, coming from UIContext
}) {
  const { mq } = useContext(MediaQuery)
  const { diceReducer, diceLogReducer } = useContext(CoinDieTokenContext)
  const { getLSasJSObject } = useContext(LocalStorageContext)
  const [log, logDispatch] = diceLogReducer
  const [diceState, diceDispatch] = diceReducer
  // ref to store min/max roll states if configged by the player
  const rollRef = useRef()
  // function to force a re-render
  const reRender = useReRender()
  // audio JSX and controls object for dice roll SFX
  const [diceAudioJSX, diceSFX] = useAudio(dicemp3, {
    toggleOn: playSFXs,
    playbackRate: 0.7
  })

  const dispatchAddDieAction = useCallback(() => {
    // add a new die to the array and play the OK sfx
    clickOKSFX.restart()
    diceDispatch(diceActionCreators.addItem({ type: "dice" }))
  }, [diceDispatch, clickOKSFX])

  const dispatchRemoveDieAction = useCallback(() => {
    // remove new die from the array and play the cancel sfx
    clickCancelSFX.restart()
    diceDispatch(diceActionCreators.removeItem())
  }, [diceDispatch, clickCancelSFX])

  const dispatchToggleLogAction = useCallback(() => {
    // toggle logging for dice actions, and show toast to notify it
    switchSFX.play()
    logDispatch(logActionCreators.toggle())
    dispatchToastAction(toastActionCreators.setLogType("DICE"))
  }, [logDispatch, dispatchToastAction, switchSFX])

  useEffect(() => {
    // on mount, get min/max player configged dice roll ranges if any.
    // To pass them to the dice array, we need a re-render (they will be
    // stored in a ref, which does not re-render the component when changing)
    const { playerConfigs } = getLSasJSObject()
    rollRef.current = playerConfigs
    reRender()
  }, [reRender, getLSasJSObject])

  return (
    <div className={styles.Container}>
      <CoinDieTokenTopScreen ariaLabel="Click on the dice to perform their rolls.">
        <TransitionGroup component={null}>
          {diceState.items.map((item, i) => (
            <CSSTransition key={i} timeout={500} classNames="dice-in-out">
              <Die
                item={item}
                diceDispatch={diceDispatch}
                logDispatch={logDispatch}
                playerConfigs={rollRef.current} // {min: <number>, max: <number>}
                diceSFX={diceSFX}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        {diceAudioJSX}
      </CoinDieTokenTopScreen>
      <CoinDieTokenBottomScreen ariaLabel="Control the dice with the buttons below.">
        <Button
          type="secondary"
          onClick={dispatchRemoveDieAction}
          disabled={diceState.items.length <= 0}
          ariaLabel={
            diceState.items.length ? "Remove one die" : "No dice to remove"
          }
          classNames={classes.plusMinusButton(mq.portrait)}
        >
          -
        </Button>
        <Button
          type={log.logState ? "primary" : "secondary"}
          onClick={dispatchToggleLogAction}
          ariaLabel="Toggle log"
          classNames={classes.logButton(mq.portrait, log.logState)}
        >
          Log {log.logState ? "ON" : "OFF"}
        </Button>
        <Button
          type="secondary"
          onClick={dispatchAddDieAction}
          disabled={diceState.items.length >= 6}
          ariaLabel={
            diceState.items.length >= 6 ? "Cannot add more dice" : "Add one die"
          }
          classNames={classes.plusMinusButton(mq.portrait)}
        >
          +
        </Button>
      </CoinDieTokenBottomScreen>
    </div>
  )
}

DiceScreen.propTypes = {
  switchSFX: PropTypes.object.isRequired,
  clickOKSFX: PropTypes.object.isRequired,
  clickCancelSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}
