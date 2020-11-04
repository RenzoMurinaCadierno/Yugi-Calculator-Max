import * as lifePointsActionTypes from "./lifePointsActionTypes"

/* incPayload: { 
    dispatchLogAction, currentplayer, isTimerRunning, 
    timerObject, value 
  }
*/
export const inc = (incPayload) => ({
  type: lifePointsActionTypes.INC,
  payload: incPayload
})

/* decPayload: { 
    dispatchLogAction, currentplayer, isTimerRunning, 
    timerObject, value 
  }
*/
export const dec = (decPayload) => ({
  type: lifePointsActionTypes.DEC,
  payload: decPayload
})

/* restartPayload: { 
    isTimerRunning, timerObject, dispatchLogAction, 
    dispatchLPAction, getLSasJSObject
  }
*/
export const restart = (restartPayload) => ({
  type: lifePointsActionTypes.RESTART,
  payload: restartPayload
})

/* confirmRestartPayload: { toggleSecondScreen } */
export const confirmRestart = (confirmRestartPayload) => ({
  type: lifePointsActionTypes.CONFIRM_RESTART,
  payload: confirmRestartPayload
})

/* modifyPayload: { value } */
export const modify = (modifyPayload) => ({
  type: lifePointsActionTypes.MODIFY,
  payload: modifyPayload
})

/* clearPayload: null */
export const clear = () => ({
  type: lifePointsActionTypes.CLEAR,
  payload: {}
})

/**
 * Switch to map upcoming CalcButton types -which are named on lifepoints
 * action types- to their respective action creator functions
 * */
export const getLifePointsActionByType = (type) => {
  switch (type) {
    case lifePointsActionTypes.INC:
      return inc
    case lifePointsActionTypes.DEC:
      return dec
    case lifePointsActionTypes.RESTART:
      return restart
    case lifePointsActionTypes.CONFIRM_RESTART:
      return confirmRestart
    case lifePointsActionTypes.MODIFY:
      return modify
    case lifePointsActionTypes.CLEAR:
      return clear
    default:
      return () => {}
  }
}
