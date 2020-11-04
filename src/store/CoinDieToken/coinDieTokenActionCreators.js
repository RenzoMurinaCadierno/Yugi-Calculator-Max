import * as coinDieTokenActionTypes from "./coinDieTokenActionTypes"

// diceOrCoinItem: <object> object with {id, res, alt, img}
export const modifyArray = (diceOrCoinItem) => ({
  type: coinDieTokenActionTypes.MODIFY_ARRAY,
  payload: diceOrCoinItem
})

// typeOfItemAsAString: <string> "coin", "dice", "token"
export const addItem = (typeOfItemAsAString) => ({
  type: coinDieTokenActionTypes.ADD_ITEM,
  payload: typeOfItemAsAString
})

// removeSelectedBoolean: <boolean> for tokens only, if true then the active
// token will be removed. False will remove the last item of the array
export const removeItem = (removeSelectedBoolean) => ({
  type: coinDieTokenActionTypes.REMOVE_ITEM,
  payload: { removeSelected: removeSelectedBoolean }
})

// id: <string> a uuidv4-generated id for tokens
export const setActiveToken = (id) => ({
  type: coinDieTokenActionTypes.SET_ACTIVE_TOKEN,
  payload: id
})

// itemId: <string> a uuidv4-generated id for tokens
// incOrDecString: <string> "inc" or "dec"
export const modifyTokenCounter = (itemId, incOrDecString) => ({
  type: coinDieTokenActionTypes.MODIFY_TOKEN_COUNTER,
  payload: { itemId, operation: incOrDecString }
})

// itemId: <string> a uuidv4-generated id for tokens
// moveForwardsBoolean: <boolean> true will move to the next image in the
// array of token images to use. false moves backwards
export const switchTokenType = (itemId, moveForwardsBoolean) => ({
  type: coinDieTokenActionTypes.SWITCH_TOKEN_TYPE,
  payload: { itemId, moveForwards: !!moveForwardsBoolean }
})
