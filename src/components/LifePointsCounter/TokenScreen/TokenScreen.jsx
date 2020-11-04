import React, { useContext, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { CoinDieTokenContext } from "../../../contexts/CoinDieTokenContext"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import * as tokenActionCreators from "../../../store/CoinDieToken/coinDieTokenActionCreators"
import useAudio from "../../../hooks/useAudio"
import CoinDieTokenBottomScreen from "../../../wrappers/CoinDieTokenBottomScreen/CoinDieTokenBottomScreen"
import CoinDieTokenTopScreen from "../../../wrappers/CoinDieTokenTopScreen/CoinDieTokenTopScreen"
import Token from "../Token/Token"
import Button from "../../UI/Button/Button"
import swipemp3 from "../../../assets/audios/swipe.mp3"
import { classes, ariaLabels } from "./TokenScreen.utils"
import styles from "./TokenScreen.module.css"

function TokenScreen({
  clickOKSFX, // <object> useAudio() controls object for BottomScreen's - button
  clickCancelSFX, // <object> useAudio() controls object for BottomScreen's + button
  playSFXs // <boolean> global state to control SFXs, coming from UIContext
}) {
  const { mq } = useContext(MediaQuery)
  const {
    tokenReducer: [tokenState, tokenDispatch]
  } = useContext(CoinDieTokenContext)
  // audio JSX and controls object for switching token types SFX
  const [swipeAudioJSX, swipeSFX] = useAudio(swipemp3, {
    toggleOn: playSFXs
  })

  const dispatchAddTokenAction = useCallback(() => {
    // add a new token to the array and play the OK sfx
    clickOKSFX.restart()
    tokenDispatch(tokenActionCreators.addItem({ type: "token" }))
  }, [tokenDispatch, clickOKSFX])

  const dispatchRemoveTokenAction = useCallback(
    // remove a token from the array and play the cancel sfx
    (e) => {
      clickCancelSFX.restart()
      tokenDispatch(tokenActionCreators.removeItem(e.target.dataset.id))
    },
    [tokenDispatch, clickCancelSFX]
  )
  // since each token needs a SFX when its counter increases/decreases and
  // when switching between its types, construct an object to pass them all
  const tokenSFXs = { add: clickOKSFX, remove: clickCancelSFX, swipe: swipeSFX }

  return (
    <div className={styles.Container}>
      <CoinDieTokenTopScreen ariaLabel="Click on the left or right arrows to increase the quantity of the token, and on top and bottom arrows to switch between token images.">
        <TransitionGroup component={null}>
          {tokenState.items.map((item) => (
            <CSSTransition
              key={item.id}
              timeout={500}
              classNames="token-in-out"
            >
              <Token
                item={item}
                tokenDispatch={tokenDispatch}
                tokenSFXs={tokenSFXs}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </CoinDieTokenTopScreen>
      <CoinDieTokenBottomScreen ariaLabel="Add/Remove tokens with the buttons below.">
        <Button
          type="secondary"
          onClick={dispatchRemoveTokenAction}
          disabled={tokenState.items.length <= 0}
          ariaLabel={ariaLabels.minusButton(tokenState.items.length)}
          classNames={classes.plusMinusButton(mq.portrait)}
        >
          -
        </Button>
        <Button
          type="secondary"
          onClick={dispatchRemoveTokenAction}
          dataId="removeSelected"
          disabled={tokenState.items.length <= 0}
          ariaLabel={ariaLabels.removeButton}
          classNames={classes.removeSelected(mq.portrait)}
        >
          Remove selected
        </Button>
        <Button
          type="secondary"
          onClick={dispatchAddTokenAction}
          disabled={tokenState.items.length >= 6}
          ariaLabel={ariaLabels.plusButton(tokenState.items.length)}
          classNames={classes.plusMinusButton(mq.portrait)}
        >
          +
        </Button>
      </CoinDieTokenBottomScreen>
      {swipeAudioJSX}
    </div>
  )
}

TokenScreen.propTypes = {
  clickOKSFX: PropTypes.object.isRequired,
  clickCancelSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired
}

export default memo(TokenScreen)
