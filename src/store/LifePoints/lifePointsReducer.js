import * as actionTypes from "./lifePointsActionTypes"
import * as lifePointsActionTypes from "./lifePointsActionTypes"
import * as logActionCreators from "../Log/logActionCreators"
import Validator from "../../utils/validators"
import {
  isValidRestartCondition,
  getLogDisplayText
} from "../../utils/utilityFunctions"
import uiConfigs from "../../utils/ui.configs.json"

const initialState = {
  p1: 8000,
  p2: 8000,
  tempLP: uiConfigs.tempLP.init
}

export default (state = initialState, action) => {
  // we will need these two across the statement. Define them.
  let currentPlayerLP, LPToCalculate
  // destructure all other required variables
  const { min, max } = uiConfigs.lpLimits
  const {
    dispatchLogAction,
    currentPlayer,
    playerNames,
    isTimerRunning,
    timerObject,
    value,
    getLSasJSObject,
    toggleSecondScreen
  } = action.payload

  switch (action.type) {
    case actionTypes.INC:
      // if there's nothing to add, then do nothing
      if (state.tempLP === "0") return state
      // log the action if needed
      dispatchLogAction(
        logActionCreators.log({
          type: lifePointsActionTypes.INC,
          text: getLogDisplayText(
            currentPlayer,
            "+",
            state,
            { min, max },
            playerNames
          ),
          timer: isTimerRunning
            ? `${timerObject.hs}:${timerObject.mins}:${timerObject.secs}`
            : ""
        })
      )
      // get the active player's LP and tempLP from state
      currentPlayerLP = state[currentPlayer]
      LPToCalculate = Number.parseInt(state.tempLP)
      // if the addition would exceed the LP limits set in uiConfigs, then
      // set the current player's LP to its max value and update state
      if (
        new Validator(currentPlayerLP, LPToCalculate).intWouldBeHigherThan(
          uiConfigs.lpLimits.max
        )
      ) {
        return {
          ...state,

          [currentPlayer]: uiConfigs.lpLimits.max,
          tempLP: uiConfigs.tempLP.init
        }
      }
      // otherwise, add both LP variables up and set current player's state with it
      return {
        ...state,
        [currentPlayer]: currentPlayerLP + LPToCalculate,
        tempLP: uiConfigs.tempLP.init
      }

    case actionTypes.DEC:
      // if there's nothing to substract manually, then do nothing
      if (state.tempLP === "0" && value === "-") return state
      // fixedButtonLPValue will either hold '1/2' if we are halving LP,
      // state.tempLP if we are deducting LP manually using '-', or the
      // absolute value of the automatic -100, -500 and -1000 buttons
      const fixedButtonLPValue =
        value === "1/2" ? value : value === "-" ? state.tempLP : -value
      // log the action if needed
      dispatchLogAction(
        logActionCreators.log({
          type: lifePointsActionTypes.DEC,
          text: getLogDisplayText(
            currentPlayer,
            "-",
            state,
            { min, max },
            playerNames,
            fixedButtonLPValue
          ),
          timer: isTimerRunning
            ? `${timerObject.hs}:${timerObject.mins}:${timerObject.secs}`
            : ""
        })
      )
      // get the active player's LP from state
      currentPlayerLP = state[currentPlayer]
      // are we halving lifepoints with the respective CalcButton?
      // If so, set LPToCalculate to half currentPlayerLP, else just payload
      if (fixedButtonLPValue === "1/2") {
        LPToCalculate = Number.parseInt(currentPlayerLP / 2)
      } else {
        LPToCalculate = Number.parseInt(fixedButtonLPValue)
      }
      // upon substraction, if current player's lifepoints are lower than the
      // minimum set in uiConfigs, set them to the minimum and update state
      if (
        new Validator(currentPlayerLP, LPToCalculate).intWouldBeLowerThan(
          uiConfigs.lpLimits.min
        )
      ) {
        return {
          ...state,
          [currentPlayer]: uiConfigs.lpLimits.min,
          tempLP: uiConfigs.tempLP.init
        }
      }
      // otherwise, substract and update the state
      return {
        ...state,
        [currentPlayer]: currentPlayerLP - LPToCalculate,
        tempLP: uiConfigs.tempLP.init
      }

    case actionTypes.RESTART:
      // in order to set the LP for a new duel, we need to know if the player
      // configged them in <Configs />. Such info is stored in LocalStorage, so,
      // try parsing it. If there is not such a config, use default uiConfigs values.
      const {
        playerConfigs: { initialLifePoints }
      } = getLSasJSObject()
      const { p1, p2 } = !!initialLifePoints
        ? initialLifePoints
        : uiConfigs.initialLP
      // log the action if needed
      dispatchLogAction(
        logActionCreators.log({
          type: lifePointsActionTypes.RESTART,
          text: `[ ${p1} : ${p2} ] Starting new game`,
          timer: isTimerRunning
            ? `${timerObject.hs}:${timerObject.mins}:${timerObject.secs}`
            : ""
        })
      )
      // and update state
      return {
        ...state,
        p1,
        p2,
        tempLP: uiConfigs.tempLP.init
      }

    case actionTypes.CONFIRM_RESTART:
      // check on uiConfigs using isValidRestartCondition() if settings are
      // proper to restart the duel. Toggle a secondary screen to confirm
      // such a restart if settings are correct or do so automatically otherwise.
      // The reason for which we need setTimeout here is to event-queue up
      // toggleSecondScreen. Since it is a UIContext update, we do not want
      // it to collide with the current LPContext update. It must happen
      // synchronously, one after the other.
      setTimeout(() => {
        toggleSecondScreen(
          uiConfigs.togglers.secondaryScreens[
            `${
              isValidRestartCondition(state)
                ? "restartDuel"
                : "confirmRestartDuel"
            }`
          ]
        )
      }, 0)
      return state

    case actionTypes.CLEAR:
      // reset tempLP
      return {
        ...state,
        tempLP: uiConfigs.tempLP.init
      }

    case actionTypes.MODIFY:
      // this action triggers by pressing any <CalcButton /> with an integer as value.
      // If tempLP's length is 4 or more, there is nothing to add to tempLP
      if (state.tempLP.length > 3) return state
      // on tempLP "0"
      if (state.tempLP === "0") {
        // by clicking on "00" or "000", we are not supposed to add more zeroes to
        // tempLP, so return (we do not want tempLP being "00", "000" or "0000")
        if (value === "00" || value === "000") return state
        // otherwise override tempLP to the selected number (as string)
        // (case tempLP being length === 1)
        return {
          ...state,
          tempLP: value
        }
      }
      // on tempLP of at least 2 numbers (as string), and while attempting
      // to append "00" or "000" to tempLP with those <CalcButtons />
      if (state.tempLP.length > 1 && (value === "00" || value === "000")) {
        // append "0"s to tempLP up to length === 4 and set state with it.
        // (tempLP being "45" and tapping "00" will result in tempLP === "4500")
        // (tempLP being "45" and tapping "000" will lead to the same result)
        let completeValue = state.tempLP
        while (completeValue.length < 4) completeValue += "0"
        return {
          ...state,
          tempLP: completeValue
        }
      }
      // on any other case, append the value to what's already in tempLP
      // (cases where you add one more number to tempLP regularly)
      return {
        ...state,
        tempLP: state.tempLP + value
      }

    default:
      return state
  }
}

export function getLifePointsAudioTrack() {
  return "Oinkify Agus-style!"
}
