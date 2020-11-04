import styles from "./PriceScreen.module.css"
import uiConfigs from "../../../utils/ui.configs.json"

export const classes = {
  bestPrices: styles.BestPrices + " " + styles.BorderSecondary
}

/**
 * Converts the retailer's card price API response into a valid object to display in view,
 * in the form of an array whose items are [retailer name, card price], both strings.
 * @param {object} averagePricesObject An object containing each retailer and the best card price associated to it.
 */
export function formatCardPricesObjIntoArray(averagePricesObject, cardName) {
  // convert the object to a valid array and map it as stated below before returning
  // it as this function's resolution
  return Object.entries(averagePricesObject).map((item) => {
    // match the response. A valid retailer name is "<retailerName>_price"
    let retailerName = item[0].match(/(.+)_price/i)[1]
    // create a valid retailer url to fetch for the card by its name
    const retailerURL =
      uiConfigs.apiConfigs.retailerURLs[retailerName] +
      encodeURIComponent(cardName)
    // convert the response to uppercase
    retailerName = retailerName[0].toUpperCase() + retailerName.slice(1)
    // If the price is 0.00 (non-existant), replace it by "-.--"
    const formattedCardPrice = item[1] !== "0.00" ? item[1] : "-.--"
    // return the composed item of the formatted retailer name, price and fetch url
    return [retailerName, formattedCardPrice, retailerURL]
  })
} /* Ghost+Ogre+%26+Snow+Rabbit */
