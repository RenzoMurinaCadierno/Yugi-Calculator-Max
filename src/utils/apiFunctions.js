import {
  getCardIcon,
  getCardTypeStyle,
  getBanlistInfo,
  getRankOrLevelIconURLArray
} from "./yugiohSpecificFunctions"
import uiConfigs from "../utils/ui.configs.json"

/**
 * Gets the named search response from YgoProDeck's API. If it is an array
 * containing multiple card objects, it sets them all into card list reducer
 * array (currentList). On a single object inside the array, it populates card
 * object in the reducer (currentCard).
 * @param {array} apiResponse YgoProDeck's API response in array form
 * @param {function} functionToStoreListOfCards Reducer dispatch with type to set currentList
 * @param {object} functionToStoreSingleCard Reducer dispatch with type to set currentCard
 */
export function storeAPICall(
  apiResponse,
  functionToStoreListOfCards,
  functionToStoreSingleCard
) {
  // api response is an array with a single card object
  if (apiResponse.length === 1) {
    // construct the card object and store it in the assigned variable with
    // its respective setter function.
    functionToStoreSingleCard(getCardObject(apiResponse[0]))
  } else {
    // the search hols multiple cards, so use currentList's dispatch
    // action and store the array of responses normally.
    functionToStoreListOfCards(apiResponse)
  }
}

/**
 * From YgoProDeck's API response, it constructs a valid object for ListScreen and DescPriceScreen views.
 * @param {object} apiResponse API response containing card data as is from the database
 * @param {object} objectToFuseIfAny An object to add all properties of a valid card object. Leave empty unless strictly necessary
 */
export function getCardObject(cardApiResponse, objectToFuseIfAny = {}) {
  return {
    ...objectToFuseIfAny,
    img: cardApiResponse.card_images[0].image_url,
    prices: {
      ...objectToFuseIfAny.prices,
      averages: cardApiResponse.card_prices,
      sets: cardApiResponse.card_sets
    },
    data: {
      ...objectToFuseIfAny.data,
      id: cardApiResponse.id,
      name: cardApiResponse.name,
      race: cardApiResponse.race,
      type: [cardApiResponse.type, getCardTypeStyle(cardApiResponse.type)],
      attributeIcon: getCardIcon(cardApiResponse.attribute)
        ? getCardIcon(cardApiResponse.attribute)
        : getCardIcon(cardApiResponse.race),
      attribute: cardApiResponse.attribute,
      atk: cardApiResponse.atk,
      def: cardApiResponse.def,
      desc: cardApiResponse.desc && cardApiResponse.desc.split("\n"),
      banlist_info: [
        getBanlistInfo(cardApiResponse.banlist_info, "tcg"),
        getBanlistInfo(cardApiResponse.banlist_info, "ocg")
      ],
      starArray: getRankOrLevelIconURLArray(
        cardApiResponse.level,
        cardApiResponse.type
      ),
      level: cardApiResponse.level,
      link_value: cardApiResponse.linkval,
      link_markers: cardApiResponse.linkmarkers,
      images: cardApiResponse.card_images
    }
  }
}

/**
 * (LEGACY - Deprecated) The database got updated and this bug, removed
 * Returns true if the card string being searched contains an invalid
 * character for the API search. Otherwise, false.
 * @param {string} cardName The name of the searched card (or part of its name).
 */
export function includesInvalidFuzzyCharacter(cardName) {
  let cardNameCharArr = cardName.split("")

  for (let invalidChar of uiConfigs.invalidNameSearchCharacters) {
    if (cardNameCharArr.includes(invalidChar)) return true
  }

  return false
}

/**
 * A timeout handler for promises. Pass a promise and a timeout in ms as
 * parameters. If the time expires, the promise will reject automatically.
 * Otherwise, it will resolve or reject depending on the promise's fulfillment.
 * @param {Promise} promise The promise object to apply timeout to.
 * @param {number} time Time upon automatically rejecting, in ms.
 * @param {string} errorMsg The string the rejection will output.
 */
export function timeout(promise, time, errorMsg) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(errorMsg)
    }, time)
    promise.then(
      (res) => {
        clearTimeout(timeout)
        resolve(res)
      },
      (err) => {
        clearTimeout(timeout)
        reject(err)
      }
    )
  })
}
