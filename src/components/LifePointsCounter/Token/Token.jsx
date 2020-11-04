import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import * as tokenActionCreators from "../../../store/CoinDieToken/coinDieTokenActionCreators"
import MiniCircle from "../../UI/MiniCircle/MiniCircle"
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon"
import { classes } from "./Token.utils"

function Token({
  item, // <object> "coin" reducer object in state {id: '', res: '', alt: ''}
  tokenDispatch, // <function> token reducer's action dispatcher
  tokenSFXs, // <object> object with two useAudio()'s controls objects for token adding/removing SFX
  classNames = {} // <object> object whose keys are array of className strings. Check propTypes below
}) {
  const dispatchIncDecAction = useCallback(
    (e) => {
      // trigger the add/remove SFX and dispatch the token action to
      // modify its counter
      if (e.target.dataset.extra === "inc") tokenSFXs.add.restart()
      else tokenSFXs.remove.restart()
      tokenDispatch(
        tokenActionCreators.modifyTokenCounter(
          e.target.dataset.id,
          e.target.dataset.extra
        )
      )
    },
    [tokenDispatch, tokenSFXs.add, tokenSFXs.remove]
  )

  const dispatchSwitchTokenTypeAction = useCallback(
    // trigger the switch-token-type SFX and its reducer action, which
    // will lead to the next token image to be displayed
    (e) => {
      tokenSFXs.swipe.restart()
      tokenDispatch(
        tokenActionCreators.switchTokenType(
          e.target.dataset.id,
          e.target.dataset.extra
        )
      )
    },
    [tokenSFXs.swipe, tokenDispatch]
  )

  const dispatchSetActiveTokenAction = useCallback(
    (e) => {
      // dispatch the action that sets the clicked token as active
      tokenDispatch(tokenActionCreators.setActiveToken(e.target.dataset.id))
    },
    [tokenDispatch]
  )

  return (
    <div className={classes.container(classNames.container)}>
      <img
        src={item.img}
        alt={item.alt}
        data-id={item.id}
        onClick={dispatchSetActiveTokenAction}
        className={classes.image(item.isActive, classNames.image)}
      />
      <MiniCircle display={item.counter} isActive={item.isActive} />
      <ArrowIcon
        pointing="top"
        alt="Increase token quantity"
        dataId={item.id}
        dataExtra="inc"
        onClick={dispatchIncDecAction}
        classNames={classes.arrowClasses(
          item.isActive,
          "Top",
          classNames.arrowTop
        )}
      />
      <ArrowIcon
        pointing="right"
        alt="Change to next token type"
        dataId={item.id}
        dataExtra={true}
        onClick={dispatchSwitchTokenTypeAction}
        classNames={classes.arrowClasses(
          item.isActive,
          "Right",
          classNames.arrowRight
        )}
      />
      <ArrowIcon
        pointing="bottom"
        alt="Decrease token quantity"
        dataId={item.id}
        dataExtra="dec"
        onClick={dispatchIncDecAction}
        classNames={classes.arrowClasses(
          item.isActive,
          "Bottom",
          classNames.arrowBottom
        )}
      />
      <ArrowIcon
        pointing="left"
        alt="Change to previous token type"
        dataId={item.id}
        dataExtra=""
        onClick={dispatchSwitchTokenTypeAction}
        classNames={classes.arrowClasses(
          item.isActive,
          "Left",
          classNames.arrowLeft
        )}
      />
    </div>
  )
}

Token.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    counter: PropTypes.number.isRequired,
    alt: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired
  }).isRequired,
  tokenDispatch: PropTypes.func.isRequired,
  tokenSFXs: PropTypes.shape({
    add: PropTypes.object,
    remove: PropTypes.object,
    swipe: PropTypes.object
  }).isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    arrowTop: PropTypes.arrayOf(PropTypes.string),
    arrowRight: PropTypes.arrayOf(PropTypes.string),
    arrowBottom: PropTypes.arrayOf(PropTypes.string),
    arrowLeft: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(Token)
