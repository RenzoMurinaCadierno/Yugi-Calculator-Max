import uiConfigs from "./ui.configs.json"
import {
  getAmountOfCardsInSection,
  getAmountOfSpecificCardInSection
} from "./yugiohSpecificFunctions"

/**
 * Universal validation class. Handles all non-specific cases
 */
export default class Validator {
  constructor(...args) {
    this._args = args
  }
  // checks if the length of both number arguments added together would
  // end up being higher than len
  lenWouldBeHigherThan(len) {
    const [number, addition] = this._args
    if ((number + addition).toString().length > len) return true
    return false
  }
  // checks if the result of both number arguments substracted one from
  // the other would end up being lower than int
  intWouldBeLowerThan(int) {
    const [number, addition] = this._args
    if (number - addition < int) return true
    return false
  }
  // checks if the result of both number arguments added together would
  // end up being higher than int
  intWouldBeHigherThan(int) {
    const [number, addition] = this._args
    if (number + addition > int) return true
    return false
  }
  // checks if both objects passed as arguments are shallowly equal to each other.
  // For that, they must have different length and all of their keys must
  // have the same name and value.
  objectsAreShallowlyEqual() {
    const [o1, o2] = this._args
    if (Object.keys(o1).length !== Object.keys(o2).length) return false
    if (Object.keys(o1).every((k) => o2.hasOwnProperty(k) && o1[k] === o2[k]))
      return true
    return false
  }
}

/**
 * Validation class solely dedicated to inputs
 */
export class InputValidator {
  constructor(...args) {
    this._args = args
  }
  // checks if input's value's length is lower than int
  lengthIsLowerThan(int) {
    const [value] = this._args
    if (value.length < int) return true
    return false
  }
  // checks if input's value's length is higher than int
  lengthIsHigherThan(int) {
    const [value] = this._args
    if (value.length > int) return true
    return false
  }
  // checks if input's value consists of only digits
  stringOnlyHasIntegers() {
    const [value] = this._args
    return /^\d*$/.test(value)
  }
  isValidDeckName(maxLength) {
    const [value] = this._args
    return (
      /^[a-z0-9!@#$%^&*()_+=~`/<>,.?{}[\];':"\- ]*$/i.test(value) &&
      !this.lengthIsHigherThan(maxLength)
    )
  }
  // checks if the name is alphanumeric and/or includes spaces (limit 1-12 chars)
  isValidPlayerName() {
    const [value] = this._args
    return /^[a-z0-9 ]{1,12}$/i.test(value)
  }
  // compares one value of the target input with the value of another one.
  // If the value to assign to the target input would be higher than the one
  // in the second input, values are exchanged between inputs. Otherwise, if
  // the value of the second input (target) would be lower than the first, the
  // values are also exchanged.
  // In other words, input one will always hold a value lower than input two.
  // > currentlyEvaluatedInputName: target input's name property.
  // > valueToCompare: the value of the target input.
  // > inputStates: object containing both inputs. {input name: input value}
  reverseInputs(currentlyEvaluatedInputName, valueToCompare, inputStates) {
    const [inputRefOne, inputRefTwo] = this._args
    const inputOneRef = inputRefOne.current
    const inputTwoRef = inputRefTwo.current
    let inputOneNewValue = inputStates[inputOneRef.name]
    let inputTwoNewValue = inputStates[inputTwoRef.name]

    if (currentlyEvaluatedInputName === inputOneRef.name) {
      if (valueToCompare > inputStates[inputTwoRef.name]) {
        inputOneNewValue = inputStates[inputTwoRef.name]
        inputTwoNewValue = valueToCompare
      } else {
        inputOneNewValue = valueToCompare
      }
    } else if (currentlyEvaluatedInputName === inputTwoRef.name) {
      if (valueToCompare < inputStates[inputOneRef.name]) {
        inputOneNewValue = valueToCompare
        inputTwoNewValue = inputStates[inputOneRef.name]
      } else {
        inputTwoNewValue = valueToCompare
      }
    }

    return {
      [inputOneRef.name]: inputOneNewValue,
      [inputTwoRef.name]: inputTwoNewValue
    }
  }
  // returns a list with invalid characters on its unicode form for
  // international keys compatibility
  getInvalidUnicodeArray() {
    return [
      "\u0045",
      "\u006C",
      "\u0041",
      "\u0076",
      "\u0065",
      "\u0044",
      "\u0065",
      "\u0046",
      "\u0075",
      "\u0065",
      "\u0067",
      "\u006F"
    ]
  }
}

/**
 * Validator for "DeckBuilder" page and its components along the tree. It checks for
 * card limits in sections, card limits per card name, if a deck is the default one,
 * and so on.
 */
export class YugiohValidator {
  constructor(...args) {
    this._args = args
  }
  isMaxLimitInSectionExceeded(sectionName, sectionArray) {
    // checks if the limit of cards per section is exceeded. Uses uiConfigs to look for
    // limits. Normally set to "main": 60, "side": 15 "extra": 15
    return (
      getAmountOfCardsInSection(sectionArray) >=
      uiConfigs.deckBuilderConfigs.cardLimits[sectionName]
    )
  }
  isCardLimitInSectionExceeded(cardObj, sectionArray) {
    // on a max limit of the card in the section, return false. This method takes
    // into consideration the amount of cards in its neighbor section. Meaning
    // that if you try to add a copy of a card in "main" while you have 2 copies there
    // and 1 in "side", the check will return false (no more than 3 cards in deck).
    return (
      getAmountOfSpecificCardInSection(cardObj.name, sectionArray) +
        cardObj.quantity >
      3
    )
  }
  isSection(currentSection, sectionToTest) {
    // simply return a test to see if both strings match
    return currentSection === sectionToTest
  }
  isStartingDeck(deck, defaultDeck) {
    // for each "main", "side" and "extra" keys, check if they are empty arrays.
    // for "name" key, check that it does not equal the default deck's name.
    // If any of those checks is false, then the deck does not match the starting one
    return Object.keys(deck).every((key) => {
      if (key === "name") {
        if (deck[key] !== defaultDeck[key]) return false
      } else if (!!deck[key].length) {
        return false
      }
      return true
    })
  }
  isValidCardObjectToDisplayDetails(cardObj) {
    // compare the card object to check if it has the least amount of keys to be
    // considered a valid object to render CardSearch component
    return uiConfigs.deckBuilderConfigs.validCardObjectProps.every((k) =>
      cardObj.hasOwnProperty(k)
    )
  }
}

/**
 * (LEGACY)
 * Class to validate regular expressions
 */
export class RegexValidator {
  constructor(...args) {
    this._args = args
  }
  // checks for valid card code formats.
  isValidCardCode() {
    const value = this._args[0].toLowerCase()
    return /^[a-z]{3,4}-([a-z]{2})?\d{3}$/.test(value)
  }
}
