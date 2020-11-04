import React, { useContext, useCallback } from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { CoinDieTokenContext } from "../../../contexts/CoinDieTokenContext"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import * as logActionCreators from "../../../store/Log/logActionCreators"
import * as coinActionCreators from "../../../store/CoinDieToken/coinDieTokenActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import useAudio from "../../../hooks/useAudio"
import Coin from "../Coin/Coin"
import CoinDieTokenBottomScreen from "../../../wrappers/CoinDieTokenBottomScreen/CoinDieTokenBottomScreen"
import CoinDieTokenTopScreen from "../../../wrappers/CoinDieTokenTopScreen/CoinDieTokenTopScreen"
import Button from "../../UI/Button/Button"
import coinmp3 from "../../../assets/audios/coin.mp3"
import { classes } from "./CoinScreen.utils"
import styles from "./CoinScreen.module.css"

export default function CoinScreen({
  switchSFX, // <object> useAudio() controls object for BottomScreen's log button
  clickOKSFX, // <object> useAudio() controls object for BottomScreen's - button
  clickCancelSFX, // <object> useAudio() controls object for BottomScreen's + button
  playSFXs, // <boolean> global state to control SFXs, coming from UIContext
  dispatchToastAction // <function> <Toast /> action dispatcher, coming from UIContext
}) {
  const { mq } = useContext(MediaQuery)
  const { coinReducer, coinLogReducer } = useContext(CoinDieTokenContext)
  const [log, logDispatch] = coinLogReducer
  const [coinState, coinDispatch] = coinReducer
  // audio JSX and controls object for coin toss SFX
  const [coinAudioJSX, coinSFX] = useAudio(coinmp3, {
    toggleOn: playSFXs,
    playbackRate: 0.7
  })

  const dispatchAddCoinAction = useCallback(() => {
    // add a new coin to the array and play the OK sfx
    clickOKSFX.restart()
    coinDispatch(coinActionCreators.addItem({ type: "coin" }))
  }, [coinDispatch, clickOKSFX])

  const dispatchRemoveCoinAction = useCallback(() => {
    // remove a coin from the array and play the cancel sfx
    clickCancelSFX.restart()
    coinDispatch(coinActionCreators.removeItem())
  }, [coinDispatch, clickCancelSFX])

  const dispatchToggleLogAction = useCallback(() => {
    // toggle logging for coin actions, and show toast to notify it
    switchSFX.play()
    logDispatch(logActionCreators.toggle())
    dispatchToastAction(toastActionCreators.setLogType("COINS"))
  }, [logDispatch, dispatchToastAction, switchSFX])

  return (
    <div className={styles.Container}>
      <CoinDieTokenTopScreen ariaLabel="Click on the coins to flip them.">
        <TransitionGroup component={null}>
          {coinState.items.map((item, i) => (
            <CSSTransition key={i} timeout={250} classNames="coin-in-out">
              <Coin
                item={item}
                coinDispatch={coinDispatch}
                logDispatch={logDispatch}
                coinSFX={coinSFX}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        {coinAudioJSX}
      </CoinDieTokenTopScreen>
      <CoinDieTokenBottomScreen ariaLabel="Control the coins with the buttons below.">
        <Button
          type="secondary"
          onClick={dispatchRemoveCoinAction}
          disabled={coinState.items.length <= 0}
          ariaLabel={
            coinState.items.length ? "Remove one coin" : "No coins to remove"
          }
          classNames={classes.plusMinusButton(mq.portrait)}
        >
          -
        </Button>
        <Button
          type={log.logState ? "primary" : "secondary"}
          onClick={dispatchToggleLogAction}
          ariaLabel="Toggle Log"
          classNames={classes.logButton(mq.portrait, log.logState)}
        >
          Log {log.logState ? "ON" : "OFF"}
        </Button>
        <Button
          type="secondary"
          onClick={dispatchAddCoinAction}
          disabled={coinState.items.length >= 6}
          ariaLabel={
            coinState.items.length >= 6
              ? "Cannot add more coins"
              : "Add one coin"
          }
          classNames={classes.plusMinusButton(mq.portrait)}
        >
          +
        </Button>
      </CoinDieTokenBottomScreen>
    </div>
  )
}

CoinScreen.propTypes = {
  switchSFX: PropTypes.object.isRequired,
  clickOKSFX: PropTypes.object.isRequired,
  clickCancelSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}
