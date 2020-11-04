import React, { memo, useContext } from "react"
import PropTypes from "prop-types"
import { LocalStorageContext } from "../../../contexts/LocalStorageContext"
import { LPContext } from "../../../contexts/LPContext"
import { PlayerContext } from "../../../contexts/PlayerContext"
import * as lifePointsActionCreators from "../../../store/LifePoints/lifePointsActionCreators"
import Button from "../../UI/Button/Button"
// import styles from './CalcButton.module.css'

function CalcButton({
  value, // <string> button's label
  dispatchLogAction, // <function> log reducer action dispatcher
  disabled, // <boolean> gray-styled disabled
  nonStyledDisabled, // <boolean> null click disabled with no style changes
  ariaLabel, // <string> aria-label to assign to the button
  ariaPressed, // <boolean> ARIA pressed boolean
  timerObject, // <object> current timer object { hs: <number>, mins: <number>, secs: <number>}
  isTimerRunning, // <boolean> true if timer has started
  toggleSecondScreen, // <function> secondary screen toggler
  dataId, // <string> button's type, which matches a lifepoints reducer action type
  classNames, // <Array> array of className strings
  children // <string|React.node> what is to be rendered as children
}) {
  const { dispatchLPAction } = useContext(LPContext)
  const { currentPlayer, playerNames } = useContext(PlayerContext)
  const { getLSasJSObject } = useContext(LocalStorageContext)
  // calculator buttons handle all lifepoints actions for both players:
  // increasing, resetting or decreasing by a variable or fixed amount.
  // Naturally, the reducer action they trigger needs a payload can handle
  // all those. They are explained in detail in lifePointsReducer.js
  const payload = {
    value,
    dispatchLPAction,
    currentPlayer,
    playerNames,
    getLSasJSObject,
    dispatchLogAction,
    isTimerRunning,
    timerObject,
    toggleSecondScreen
  }

  const handleDispatchLPAction = (e) => {
    // map the data-id assigned to each button to its respective lifepoints action
    // creator, assign the payload and dispatch that action.
    // data-id corresponds to the button type, which matches a lifepoints action type.
    dispatchLPAction(
      lifePointsActionCreators.getLifePointsActionByType(e.target.dataset.id)(
        payload
      )
    )
  }

  return (
    <Button
      type="secondary"
      dataId={dataId}
      disabled={disabled}
      nonStyledDisabled={nonStyledDisabled}
      ariaLabel={ariaLabel}
      ariaPressed={ariaPressed}
      classNames={classNames}
      onClick={handleDispatchLPAction}
    >
      {children}
    </Button>
  )
}

CalcButton.propTypes = {
  value: PropTypes.string.isRequired,
  dispatchLogAction: PropTypes.func,
  disabled: PropTypes.bool,
  nonStyledDisabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaPressed: PropTypes.bool,
  timerObject: PropTypes.shape({
    hs: PropTypes.string,
    mins: PropTypes.string,
    secs: PropTypes.string
  }),
  isTimerRunning: PropTypes.bool,
  toggleSecondScreen: PropTypes.func,
  dataId: PropTypes.string,
  classNames: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired
}

export default memo(CalcButton)
