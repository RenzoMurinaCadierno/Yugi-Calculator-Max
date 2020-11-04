import { v4 as uuidv4 } from "uuid"
import * as coinDieTokenActionTypes from "./coinDieTokenActionTypes"
import { getNextTokenImgAndAlt } from "../../utils/yugiohSpecificFunctions"
import spellIcon from "../../assets/tokenIcons/spell.svg"

export default function coinDieTokenReducer(state, action) {
  switch (action.type) {
    case coinDieTokenActionTypes.MODIFY_ARRAY:
      const { id, res, alt, img } = action.payload
      // if img is defined, we are dealing with a token. Else if alt is defined,
      // we are getting a coin. Otherwise, a dice.
      const payload = img
        ? { id, res, alt, img }
        : alt
        ? { id, res, alt }
        : { id, res }
      return {
        ...state,
        items: state.items.map((item) => (item.id === id ? payload : item))
      }

    case coinDieTokenActionTypes.REMOVE_ITEM:
      const items = state.items
      // do nothing if there is nothing to remove.
      if (items.length < 1) return state
      // given the case we are removing a token item with "Remove selected"
      // <Button />, we will get true as payload. Otherwise, payload will
      // be undefined, so we default to the last item in the list
      const indexToRemove = action.payload?.removeSelected
        ? items.findIndex((item) => item.isActive)
        : items.length - 1
      // if we are attempting to remove an active token item (given that there
      // are more than 1 item left to remove)
      if (items.length > 1 && items[indexToRemove].isActive) {
        // in the event that we are removing the first item in the array, we
        // set the second item as the next active candidate. If we are removing
        // any item but the first one, then set the previous one as candidate.
        const itemBeforeOrAfterTheOneRemoved = indexToRemove
          ? { ...items[indexToRemove - 1] }
          : { ...items[indexToRemove + 1] }
        // change its active status to true
        itemBeforeOrAfterTheOneRemoved.isActive = true
        // slice items array accodingly and insert the new active candidate into it.
        return {
          ...state,
          items: [
            ...items.slice(0, indexToRemove ? indexToRemove - 1 : 0),
            itemBeforeOrAfterTheOneRemoved,
            ...items.slice(
              indexToRemove ? indexToRemove + 1 : indexToRemove + 2
            )
          ]
        }
      }
      // isActive check above applies only to token array items, so for coin
      //and dice, just remove the items at the last index and set state
      return {
        ...state,
        items: items.slice(0, -1)
      }

    case coinDieTokenActionTypes.ADD_ITEM:
      // do nothing is 6 tokens/dice/coins are in items array already.
      if (state.items.length >= 6) return state
      // tokens need all previous ones to be set to inactive to enable
      // the next one in list to be the active one. Once set, then concat
      // the new item and set state with it. As a bonus, use the same img
      // and alt as the previous one in the array.
      if (action.payload.type === "token") {
        const items = state.items
        // set all tokens to inactive
        const prevState = items.map((item) => {
          return { ...item, isActive: false }
        })
        // get the img and alt for the new token. Default one if array is empty.
        const imgAndAlt = items.length
          ? {
              img: items[items.length - 1].img,
              alt: items[items.length - 1].alt
            }
          : { img: spellIcon, alt: "Token type 1" }
        // set state with all tokens set as inactive, plus the new active one
        return {
          ...state,
          items: [
            ...prevState,
            {
              id: uuidv4(),
              counter: 1,
              img: imgAndAlt.img,
              alt: imgAndAlt.alt,
              isActive: true
            }
          ]
        }
      }
      // coins and dice are more straightforward. Since they do not require
      // the previous state to be modified, just concat the new item
      return {
        ...state,
        items:
          action.payload.type === "coin"
            ? [...state.items, { id: uuidv4(), res: "", alt: "" }]
            : [...state.items, { id: uuidv4(), res: [] }]
      }

    case coinDieTokenActionTypes.SET_ACTIVE_TOKEN:
      // if the target token is already active, do nothing
      if (
        state.items[state.items.findIndex((item) => item.id === action.payload)]
          .isActive
      ) {
        return state
      }
      // set the target item as active and all others to inactive
      return {
        ...state,
        items: state.items.map((item) => {
          return { ...item, isActive: item.id === action.payload }
        })
      }

    case coinDieTokenActionTypes.MODIFY_TOKEN_COUNTER:
      const { itemId, operation } = action.payload
      // get the index separatedly if we need it to splice items array
      const targetItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      )
      // and get the item itself to work with
      const targetItem = state.items[targetItemIndex]
      // CASE 1: while trying to add to a counter at 99 or trying to decrese
      // the counter while unmounting, do nothing
      if (!targetItem || (operation === "inc" && targetItem.counter >= 99)) {
        return state
      }
      // CASE 2: substracting beyond 0 removes the item from the list
      else if (operation === "dec" && targetItem.counter <= 0) {
        let newItems = [...state.items]
        // remember if the item to be removed was active
        const itemWasActive = newItems[targetItemIndex].isActive
        // remove the item
        newItems.splice(targetItemIndex, 1)
        // if the removed item was the last one in the list and was active,
        // we need to set the new last item as active. For that, we calculate
        // the new index and re-set the array with new active conditions
        if (newItems.length && itemWasActive) {
          const newSelectedIndex =
            targetItemIndex >= newItems.length
              ? newItems.length - 1
              : targetItemIndex
          newItems = newItems.map((item, i) => {
            return { ...item, isActive: i === newSelectedIndex }
          })
        }
        // finally, set state with the modified array
        return {
          ...state,
          items: newItems
        }
      }
      // CASE 3: set the item as active and modify the counter accordingly.
      // All other items are set to inactive.
      return {
        ...state,
        items: state.items.map((item) => {
          return item.id === targetItem.id
            ? {
                ...item,
                isActive: true,
                counter:
                  operation === "inc" ? item.counter + 1 : item.counter - 1
              }
            : { ...item, isActive: false }
        })
      }

    case coinDieTokenActionTypes.SWITCH_TOKEN_TYPE:
      // find the index of the current token in items array
      const itemTarget =
        state.items[
          state.items.findIndex((item) => item.id === action.payload.itemId)
        ]
      // get the new img and alt for it
      const imgAndAlt = getNextTokenImgAndAlt(
        itemTarget.img,
        action.payload.moveForwards
      )
      // set all tokens in the array as inactive except the one we switched
      // img and alt. Of course, set the new img and alt to it too
      return {
        ...state,
        items: state.items.map((item) => {
          return item.id === action.payload.itemId
            ? {
                ...item,
                img: imgAndAlt.img,
                alt: imgAndAlt.alt,
                isActive: true
              }
            : { ...item, isActive: false }
        })
      }

    default:
      return state
  }
}
