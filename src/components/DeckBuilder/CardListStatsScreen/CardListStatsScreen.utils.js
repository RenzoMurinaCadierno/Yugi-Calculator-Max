import styles from "./CardListStatsScreen.module.css"

export const classes = {
  screenDivisionTop: [styles.ScreenDivisionTop]
}

/**
 * Returns an object with all valid values to form CardListStatsScreen component.
 * That returned object includes:
 * > Each card type as an individual object with their quantities
 *   according to fallbackTestDeck and the chance to draw a card of that type.
 * > The total amount of cards remaining in dallbackTestDeck
 * > An array with all remaining card objects in fallbackTestDeck, without repeating
 *   names and with their remaining qantities
 * @param {Array} spreadedCardObjectsArray an array with card objects where each object can have the same card name, but quantities of 1
 */
export function getTestDeckStats(spreadedCardObjectsArray) {
  const statsObject = spreadedCardObjectsArray.reduce(
    (acc, cardObj) => {
      // only "monster", "spell" and "trap" are valid keys to calculate %
      let typeString = cardObj.type.split(" ")[0].toLowerCase()
      if (typeString !== "spell" && typeString !== "trap") {
        typeString = "monster"
      }
      // save each card name as key entry for "remainingCards"
      const currCardVal = acc.remainingCards[cardObj.name]
      return {
        ...acc,
        // sum up the quantities for each "monster", "spell" and "trap" cards
        [typeString]: {
          qty: acc[typeString].qty + cardObj.quantity
        },
        // sum up the total of cards
        total: acc.total + cardObj.quantity,
        // re-merge all cards objects into one for each card name, with their
        // corresponding quantities. The aim here is to reconstruct "fallbackTestDeck"
        // to ressemble "deckstate.deck_<id>.main", without making use of it
        remainingCards: currCardVal
          ? {
              ...acc.remainingCards,
              [cardObj.name]: {
                ...currCardVal,
                quantity: currCardVal.quantity + 1
              }
            }
          : { ...acc.remainingCards, [cardObj.name]: cardObj }
      }
    },
    {
      monster: { qty: 0 },
      spell: { qty: 0 },
      trap: { qty: 0 },
      total: 0,
      remainingCards: {}
    }
  )
  // for each "monster", "spell" and "trap" key in object, create their "chance"
  // key and assign their average versus the total amount of cards. We need to
  // do this here and not in reduce above since we need the total amount of cards
  // to be calculated first
  new Array("monster", "spell", "trap").forEach(
    (type) =>
      (statsObject[type].chance = statsObject.total
        ? (statsObject[type].qty / statsObject.total) * 100
        : 0)
  )
  // since "remainingCards" is an object with card names as keys and the whole card object
  // as their values, converge them all in a single sorted array with the function below
  statsObject.remainingCards = sortRemainingCards(statsObject.remainingCards)
  // return the whole object as is
  return statsObject
}

/**
 * Gets the array formed with getTestDeckStats() "remainingCards" nested object which
 * holds all cards with no name repetition and proper quantities, uses a Map to sort
 * them out by type and name, constructs a flat array with the arranged values and returns it.
 * @param {object} remainingCards The object resulting from statsObject.remainingCards,
 * which contains an array of all disordered cards
 */
function sortRemainingCards(remainingCards) {
  // create the map and fill it with each category, with an empty array on each
  const typeMap = new Map()
  const typeStrings = ["Monster", "Spell", "Trap"]
  typeStrings.forEach((type) => typeMap.set(type, []))
  // push each card object to its type array inside the map
  Object.values(remainingCards).forEach((cardObj) => {
    let type = cardObj.type.split(" ")[0]
    if (type !== "Spell" && type !== "Trap") type = "Monster"
    typeMap.get(type).push(cardObj)
  })
  // sort each type array in the map by their name in descending order
  typeStrings.forEach((type) =>
    typeMap.get(type).sort((a, b) => (a.name > b.name ? 1 : -1))
  )
  // flat all map arrays into a single one and return it
  return Array.from(typeMap.values()).flat()
}
