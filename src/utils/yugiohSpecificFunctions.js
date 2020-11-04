import uiConfigs from "../utils/ui.configs.json"
import light from "../assets/cardIcons/light.svg"
import dark from "../assets/cardIcons/dark.svg"
import earth from "../assets/cardIcons/earth.svg"
import fire from "../assets/cardIcons/fire.svg"
import water from "../assets/cardIcons/water.svg"
import wind from "../assets/cardIcons/wind.svg"
import divine from "../assets/cardIcons/divine.svg"
import spell from "../assets/cardIcons/spell.svg"
import trap from "../assets/cardIcons/trap.svg"
import trapspell from "../assets/cardIcons/trapspell.svg"
import normal from "../assets/cardIcons/normal.svg"
import continuous from "../assets/cardIcons/continuous.svg"
import quick from "../assets/cardIcons/quick.svg"
import field from "../assets/cardIcons/field.svg"
import equip from "../assets/cardIcons/equip.svg"
import ritual from "../assets/cardIcons/ritual.svg"
import lvStar from "../assets/cardIcons/lv-star.svg"
import xyzStar from "../assets/cardIcons/xyz-star.svg"
import tokenSpell from "../assets/tokenIcons/spell.svg"
import tokenLight from "../assets/tokenIcons/light.svg"
import tokenDark from "../assets/tokenIcons/dark.svg"
import tokenWind from "../assets/tokenIcons/wind.svg"
import tokenFire from "../assets/tokenIcons/fire.svg"
import tokenWater from "../assets/tokenIcons/water.svg"
import tokenEarth from "../assets/tokenIcons/earth.svg"

/**
 * Gets the attribute of the card and returns the respective svg related icon.
 * @param {string} cardAttribute The card attribute or type if it is not a monster card
 */
export function getCardIcon(cardAttribute) {
  if (!cardAttribute) return null

  switch (cardAttribute.toLowerCase()) {
    case "light":
      return light
    case "dark":
      return dark
    case "wind":
      return wind
    case "water":
      return water
    case "fire":
      return fire
    case "earth":
      return earth
    case "spell":
      return spell
    case "trap":
      return trap
    case "continuous":
      return continuous
    case "quick-play":
      return quick
    case "field":
      return field
    case "equip":
      return equip
    case "ritual":
      return ritual
    case "divine":
      return divine
    case "trapspell":
      return trapspell
    case "normal":
    default:
      return normal
  }
}

/**
 * Takes the card type and returns the rgb color associated to it
 * @param {string} cardType The card type
 */
export function getCardTypeStyle(cardType, opacity = 1) {
  // card type is needed. Assigning none will return null
  if (!cardType) return null
  // split the card type string
  let splittedTypeString = cardType.split(" ")
  // compare the first word on each and return the respective type color
  switch (splittedTypeString[0].toLowerCase()) {
    case "effect":
    case "flip":
    case "spirit":
    case "tuner":
      return "rgba(209, 143, 89, " + opacity + ")"
    case "spell":
      return "rgba(57, 190, 146, " + opacity + ")"
    case "trap":
      return "rgba(204, 69, 143, " + opacity + ")"
    case "link":
      return "rgba(19, 95, 182, " + opacity + ")"
    case "xyz":
      return "rgba(80, 80, 107, " + opacity + ")"
    case "synchro":
      return "rgba(224, 226, 228, " + opacity + ")"
    case "fusion":
      return "rgba(124, 74, 204, " + opacity + ")"
    case "ritual":
      return "rgba(42, 88, 212, " + opacity + ")"
    case "pendulum":
      // "Pendulum Effect Fusion Monsters" are the only case of an extra deck
      // dual type Pendulum monster whose type does not start with the counterpart
      // type name ("Synchro Pendulum", "XYZ Pendulum" vs "Pendulum Fusion").
      // We have to manually assign the fusion color as it will fall back to the
      // regular pendulum color otherwise, not suitable for extra deck visual cue
      if (splittedTypeString[2] && splittedTypeString[2] === "Fusion") {
        return "rgba(124, 74, 204, " + opacity + ")"
      }
      // any other case is a main deck pendulum card
      return "rgba(252, 65, 242, " + opacity + ")"
    case "normal":
      return "rgba(219, 202, 44, " + opacity + ")"
    case "toon":
    case "skill":
      return "rgba(137, 217, 214, " + opacity + ")"
    default:
      return null
  }
}

/**
 * Gets YgoProDeck's banlist API response and converts it to a valid format to display as view.
 * Valid response: [status, format], both strings.
 * @param {object} fetchedBalistData API banlist response {ban_tcg: <status>, ban_ocg: <status>}
 * @param {string} format "tcg" or "ocg"
 */
export function getBanlistInfo(fetchedBalistData, format) {
  // a null/undefined response, or a missing particular ban format means
  // the card is unlimited
  if (!fetchedBalistData || !fetchedBalistData["ban_" + format]) {
    return ["Unlimited", format]
  }
  // otherwise, return the status and the format
  return [fetchedBalistData["ban_" + format], format]
}

/**
 * Gets the type of the card and its level/rank and returns an array of svg icons
 * to render as their proper level/rank.
 * @param {number} rankOrLevel The level or rank of the card
 * @param {string} cardType The type of the card (XYZ Monster, Synchro Monster, and so on)
 */
export function getRankOrLevelIconURLArray(rankOrLevel, cardType) {
  // a falsy cardType or not a monster card does not require this calculation
  if (!cardType || !isMonsterCard(cardType)) return null
  // create an array whose length === the level/rank/link value
  const starArray = new Array(rankOrLevel)
  // if it is an XYZ monster, fill it with XYZ star svg icons, else with normal star icons
  cardType === "XYZ Monster" ? starArray.fill(xyzStar) : starArray.fill(lvStar)
  // and return the array
  return starArray
}

/**
 * Returns true if the card type is a valid Monster card, false otherwise.
 * @param {string} cardType The card type
 */
export function isMonsterCard(cardType) {
  return !uiConfigs.notMonsterCardsArray.includes(cardType)
}

// array of token images to loop when switching token types
const tokenIconArray = [
  tokenSpell,
  tokenLight,
  tokenDark,
  tokenWind,
  tokenFire,
  tokenWater,
  tokenEarth
]

/**
 * Returns the next image and alt to switch the token to.
 * @param {string} currentImg svg image of the current token
 * @param {boolean} moveForwards True will move to the next img in the array, false, backwards
 */
export function getNextTokenImgAndAlt(currentImg, moveForwards) {
  // target the respective image in the array, and move to the previous
  // or the next one, depending on moveForwards boolean
  let nextIndex =
    tokenIconArray.findIndex((arrayImg) => arrayImg === currentImg) +
    (moveForwards ? 1 : -1)
  // loop to the first image if we exceed tokenArray.length
  if (nextIndex >= tokenIconArray.length) nextIndex = 0
  // or loop to the end if we go lower than 0
  else if (nextIndex < 0) nextIndex = tokenIconArray.length - 1
  // return an object with the new img and alt for the token
  return {
    img: tokenIconArray[nextIndex],
    alt: "Token type " + (nextIndex + 1)
  }
}

/**
 * Gets a card object's name and an array of all cards for each "main", "side" and
 * "extra" sections and returns amount of cards with the same passed name in all
 * sections combined.
 * @param {string} cardName the card's name to look for in the section
 * @param  {...Array} deckSectionsArrays An array of card objects for each section
 */
export function getCardQuantityInDeck(cardName, ...deckSectionsArrays) {
  return deckSectionsArrays
    .flat()
    .reduce(
      (acc, currCard) =>
        currCard.name === cardName ? acc + currCard.quantity : acc,
      0
    )
}

/**
 * Takes a card object with all properties needed to be displayed in CardSearch
 * component and reduces it to the bare minimum keys to be considered a valid
 * object to display in DeckConstructor component. This is such because we need
 * to display thousands of elements at once, thus speeding up the process.
 * @param {object} detailedCardObj A card object with all properties neeeded in CardSearch Component
 */
export function getSimpleCardTypeObj(detailedCardObj) {
  return {
    name: detailedCardObj.name,
    type: detailedCardObj.type,
    quantity: detailedCardObj.quantity
  }
}

/**
 * Returns the sum of card object's quantity key in the section array
 * @param {Array} sectionArray An array of card objects of the target section
 */
export function getAmountOfCardsInSection(sectionArray) {
  return sectionArray.reduce((acc, cardObj) => acc + cardObj.quantity, 0)
}

/**
 * Gets the quantity of cards with the passed name on the section array.
 * @param {string} targetCardName the card's name to look for in the section
 * @param {Array} sectionArray An array of card objects of the target section
 */
export function getAmountOfSpecificCardInSection(targetCardName, sectionArray) {
  const cardIndexInSection = sectionArray.findIndex(
    (cardObj) => cardObj.name === targetCardName
  )
  return cardIndexInSection > -1 ? sectionArray[cardIndexInSection].quantity : 0
}

/**
 * Gets the in-section index position of the card whose name matches target card's
 * @param {Array} sectionArray An array of card objects of the target section
 * @param {string} targetCardName the card's name to look for in the section
 */
export function getCardIndexInSection(sectionArr, targetCardName) {
  return sectionArr.findIndex((card) => card.name === targetCardName)
}

/**
 * Returns the Toast message to display when deck limit is alraedy reached and we try
 * to add a new deck
 */
export function getDeckLimitToastMessage() {
  return "Nice frontend and/or spaghettigraphy skills! Tell bikein ryuhart I said hi."
}

/**
 * Compares the card type versus the ones that fit inside the Extra Deck. If there's
 * a match, it returns "extra". If it does not match, then the card belongs to "main"
 * deck, thus returning "main".
 * @param {string} cardType The card type
 */
export function getCardDefaultSection(cardType) {
  return uiConfigs.deckBuilderConfigs.extraDeckCards.includes(cardType)
    ? "extra"
    : "main"
}

/**
 * Given the current active deck section ("main", "side", "extra"), it returns
 * The available section where the selected card can be moved to (as a string).
 * E.g.: an XYZ monster in the side deck can be moved to the extra deck but not
 * to the main deck. A normal monster can be moved from the main to the side, and
 * so on.
 * @param {string} cardType The card type
 * @param {string} currentSection The active section ("main", "side", "extra")
 */
export function getCardReverseSection(cardType, currentSection) {
  return currentSection === "side" ? getCardDefaultSection(cardType) : "side"
}

/**
 * Creates and return a map whose keys are the first word of the card type, and
 * empty array as values. E.g.: {"Effect": [], "Flip": [], "Spell": [], "Trap": [], ...}
 * Given the first word of their type, card objects will be stored here to be
 * sorted and returned as a single ordered array by sortSectionAndCleanMap()
 */
export function generateCardTypeMap() {
  // create an empty map
  const cardTypeMap = new Map()
  // fill it with the first word of each card type. Repeated values will be
  // intentionally overriden to be sorted in a better fashion. Otherwise, cards
  // with multiple subtypes would not be able to be sorted alphabetically given
  // their main type.
  uiConfigs.deckBuilderConfigs.mainDeckCards.forEach((cardType) =>
    cardTypeMap.set(cardType.split(" ")[0], [])
  )
  uiConfigs.deckBuilderConfigs.extraDeckCards.forEach((cardType) =>
    cardTypeMap.set(cardType.split(" ")[0], [])
  )
  // return it
  return cardTypeMap
}

/**
 * Given the current section array of cards and a map with keys being the first
 * word of the card type ("Effect", "Trap", "Spell", "XYZ", "Link", ...) and
 * empty arrays as values, it maps all card objects into their proper type key
 * array, sorts them out and yields a flat array with all cards in order.
 * Next generator call triggers generateCardTypeMap() to regenerate the map so
 * that cards can be sorted again. This is a fallback measure to be called each
 * time a new card is added, of if we switch to a new section/deck.
 * @param {Array} sectionArray An array of card objects of the target section
 * @param {Map} sectionMap A map whose keys are the first word of the card type, and empty arrays as values
 */
export function* sortSectionAndCleanMap(sectionArray, sectionMap) {
  // fill the map of types with cards whose first word on its type matches the key.
  // E.g: {"Trap": [{name: "Mirror Force", type: "Trap"}, ...]}.
  // Note the special case of "Pendulum Effect Fusion Monster", needed to be sorted
  // as a Fusion monster, not as a Pendulum one. We cannot modify it any other way
  // since it comes as is from the database. So we manually set its type to fit.
  sectionArray.forEach((cardObj) => {
    let splittedTypeString = cardObj.type.split(" ")
    if (
      splittedTypeString[0] === "Pendulum" &&
      splittedTypeString[2] &&
      splittedTypeString[2] === "Fusion"
    ) {
      splittedTypeString[0] = "Fusion"
    }
    const currentSection = sectionMap.get(splittedTypeString[0])
    if (currentSection) currentSection.push(cardObj)
  })
  // map all arrays on each type key into a single one. Order their contents by
  // name (more organized while reading), and flat everything into a single array.
  // Yield that array to be displayed on the respective section
  yield Array.from(sectionMap.values())
    .map((cardTypeArr) =>
      cardTypeArr.sort((a, b) => (a.name > b.name ? 1 : -1))
    )
    .flat()
  // second call is applied to reconstruct the the map of all card types so that
  // we can start brand new when a new card is added or a section/deck is changed
  return generateCardTypeMap()
}

/**
 * Used by deckConstructorReducer and YugiohValidator to get the default structure
 * of a starting -empty- deck
 */
export function getStartingDeckSkeleton() {
  return {
    main: [],
    side: [],
    extra: [],
    test: [],
    name: "Starting deck"
  }
}
