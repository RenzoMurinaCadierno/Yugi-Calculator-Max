/**
 * Reduces all card objects in the passed section into an object where keys are
 * the first word on the card types for each global yugioh card type (Monster,
 * Spell, Trap, XYZ, Synchro, Fusion, Pendulum and Link). Returns an array where
 * the first element is that object with its keys' values are the quantity of
 * cards with those types, and the second element being the card total in that section.
 * @param {Array} sectionArray An array of card objects of the target section
 */
export function getCardQuantityPerTypeAndCardQuantityTotal(sectionArray) {
  // variable to store the total amount of cards in the section
  let cardTotalInSection = 0
  // the key to assign to the object we construct below
  let key = ""
  // we get a section variable in the form of an array of card objects, which
  // have the "type" and "quantity" keys. Types are a string where, in most
  // cases, their first word is the one of out interest. "Spell" Card, "Fusion" Monster
  // So, reduce the array:
  const cardQuantitiesObj = sectionArray.reduce((acc, cardObj) => {
    // add the current quantity to the card total
    cardTotalInSection += cardObj.quantity
    // split the string by words and switch using its first word
    const splittedTypeString = cardObj.type.split(" ")
    // determine the correct key name
    switch (splittedTypeString[0]) {
      case "Spell":
        key = "spell"
        break
      case "Trap":
        key = "trap"
        break
      case "XYZ":
        key = "xyz"
        break
      case "Synchro":
        key = "synchro"
        break
      case "Fusion":
        key = "fusion"
        break
      case "Pendulum":
        // pedulum cards can belong to the main and extra deck, depending on their
        // type. The only instance YGOPRODeck's database return that is a pendulum,
        // belongs to the extra deck but the first word does NOT start with its main
        // type are fusions, listed as "Pendulum Effect Fusion Monster". So, compare
        // the third array element of the splitted type to assign the key properly
        key =
          splittedTypeString[2] && splittedTypeString[2] === "Fusion"
            ? "fusion"
            : "monster"
        break
      case "Link":
        key = "link"
        break
      default:
        // all fallback cases are assumed to be generic monster cards in the main deck
        key = "monster"
    }
    // do we have a key with the same name in the object? Add the current card's
    // quantity. Otherwise, assign it and initialize it with current card's quantity
    return acc[key]
      ? { ...acc, [key]: acc[key] + cardObj.quantity }
      : { ...acc, [key]: cardObj.quantity }
  }, {})
  // finally, return the constructed object and the card total in the section
  return [cardQuantitiesObj, cardTotalInSection]
}
