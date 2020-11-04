import React from "react"
import AnimatedNumber from "animated-number-react"
import MiniCircle from "../components/UI/MiniCircle/MiniCircle"
import { InputValidator } from "./validators"
import { getStartingDeckSkeleton } from "./yugiohSpecificFunctions"
import uiConfigs from "./ui.configs.json"

/**
 * Takes a number of dice to be rolled, rolls them and returns an array
 * with the results.
 * @param {number} numDice How many dice are to be rolled
 * @param {number} minNum The min possible roll
 * @param {number} maxNum The max possible roll
 */
export function roll(numDice, minNum = 1, maxNum = 6) {
  return [...Array(numDice)].map(() =>
    Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
  )
}

/**
 * Creates and returns a new array without the element at the given index.
 * @param {Array} arr The array to remove the element from
 * @param {number} index The index position of the element to remove
 * @param {any} element (optional), the element to inset at the given index
 */
export function getSlicedArray(arr, index, element) {
  return element
    ? [...arr.slice(0, index), element, ...arr.slice(index + 1)]
    : [...arr.slice(0, index), ...arr.slice(index + 1)]
}

/**
 * Given a string and an index, slices the string at that position and returns
 * it. If "filler" is defined, it appends it to the end of the returned string.
 * @param {string} str The string to slice
 * @param {number} index The index position of the element where the string is cut
 * @param {string} filler (optional), the string to appent to the returned string
 */
export function getSlicedString(str, index, filler) {
  if (str.length <= index) return str
  const slicedStr = str.slice(0, index)
  return filler ? slicedStr + filler : slicedStr
}

/**
 * Randomly shuffles all array contents. WARNING! Modifies the array in place.
 * @param {Array} arr the array to shuffle.
 */
export function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5)
}

/**
 * Takes a string and returns it parsed as a number.
 * If the conversion resulted in NaN, it returns the string as it.
 * @param {string} string The string to try to parse to number
 */
export function tryParseInt(string) {
  // 00 and 000 will be parsed as 0. We need both numbers, so these ones
  // are special cases we have to escape
  if (string === "00" || string === "000") return string
  // try converting and return the number version, or the string upon failure
  const conversion = Number.parseInt(string)
  return isNaN(conversion) ? string : conversion
}

/**
 * Mocks empty function calls. Believe me, we use it.
 */
export function doNothing() {}

/**
 * Returns a number fixed to the stated decimals.
 * @param {number} value the number apply toFixed() to
 * @param {number} decimalsToFixed toFixed() param. Decimals to fix the number at
 */
export function formatValue(value, decimalsToFixed) {
  return value.toFixed(decimalsToFixed)
}

/**
 * Takes an input value and its max allowed length. If the input consists
 * of integers only and its length does not exceed the maximum, it returns
 * true. False otherwise.
 * @param {string} inputValue The input value
 * @param {number} maxLength The maximum length the value should have
 */
export function validateInputOnChange(inputValue, maxLength) {
  const validator = new InputValidator(inputValue)
  return (
    validator.stringOnlyHasIntegers() &&
    !validator.lengthIsHigherThan(maxLength)
  )
}

/**
 * Takes an input value and a filler character. Considering the minimum length
 * the input should reach, if the input value is shorter, it adds fillerChar
 * to the front of the value until minLength is reached.
 * @param {string} inputValue The input value
 * @param {string} fillerChar The character to place at front
 * @param {number} minLength The minimum length allowed for that input
 */
export function fillFrontOfInput(inputValue, fillerChar, minLength) {
  const validator = new InputValidator(inputValue)
  // is the input value's length shorter than the minimum?
  if (validator.lengthIsLowerThan(minLength)) {
    // fill it up front with fillerChar values and return the result
    let valueWithFiller = ""
    for (let i = 0; i < minLength - inputValue.length; i++) {
      valueWithFiller += fillerChar
    }
    valueWithFiller += inputValue
    return valueWithFiller
  }
  // the input is already long enough. Return it as is
  return inputValue
}

/**
 * Checks the playerTag for an instance of an invalid unicode character.
 * If it finds any, it returns a warning text to display in the toast, which
 * serves as an UI/UX indicator. Otherwise, returns null to proceed as normal.
 * @param {string} playerTag currentPlayer's tag that changed
 */
export function getPlayerNameWarning(playerTag) {
  const warningText = new InputValidator(playerTag)
    .getInvalidUnicodeArray()
    .join("")
  if (warningText === playerTag) {
    document.title = uiConfigs.togglers.secondaryScreens.calculator.toUpperCase()
    return "One dedicated to you, Marce. Cheers!"
  }
  return null
}

/**
 * Transforms a Date object into a valid string to display as an IRT log.
 * That would be "mm/dd/yyyy - hh:mm:ss"
 */
export function getIRLDateTimeString() {
  try {
    const irlTime = new Date()
    return `${fillFrontOfInput(
      (irlTime.getMonth() + 1).toString(),
      "0",
      2
    )}/${fillFrontOfInput(
      irlTime.getDate().toString(),
      "0",
      2
    )}/${irlTime.getFullYear().toString()} - ${fillFrontOfInput(
      irlTime.getHours().toString(),
      "0",
      2
    )}:${fillFrontOfInput(
      irlTime.getMinutes().toString(),
      "0",
      2
    )}:${fillFrontOfInput(irlTime.getSeconds().toString(), "0", 2)}`
  } catch (err) {
    return "Date not available"
  }
}

/**
 * Gets a valid timer object as a parameter and returns a new one with a second substracted from it.
 * @param {object} timerObject The timer object. {hs: number, mins: number, secs: number}
 */
export function tick(timerObject) {
  const newTimeObject = { hs: "", mins: "", secs: "" }
  let timerArray = []
  // create a string with the timer object in the form of hh:mm:ss
  let timerString = `${timerObject.hs}:${timerObject.mins}:${timerObject.secs}`
  // get a Date.getTime() number using that timer string, substract one second from it
  // reconvert it to a Date time string and extract the hh:mm:ss part
  timerString = new Date(
    new Date("1970-01-01T" + timerString + "Z").getTime() - 1000
  )
    .toISOString()
    .substr(11, 8)
  // split it into an array
  timerArray = timerString.split(":")
  // fill the new time object with its values
  newTimeObject.hs = timerArray[0]
  newTimeObject.mins = timerArray[1]
  newTimeObject.secs = timerArray[2]
  // and return it
  return newTimeObject
}

/**
 * Gets the current player's lifepoints object and checks if any of those
 * are in uiConfigs' set range to restart the duel.
 * If they are, it returns true. Or else, false.
 * @param {object} lpState The player's life points object {p1: number, p2: number}
 * @param {number} tempLP The current operation lifepoints
 */
export function isValidRestartCondition(lpState) {
  return !(
    lpState.tempLP === String(uiConfigs.apiConfigs.limit) &&
    lpState.p1 / 2 === lpState.p2 - lpState.p1
  )
}

/**
 * Gets valid current time and initial time objects used for the timer and returns
 * all necessary values needed to render ProgressBar component.
 * @param {object} currentTime current time object. {hs: <number>, mins: <number>, secs: <number>}
 * @param {object} initialTime initial time object. {hs: <number>, mins: <number>, secs: <number>}
 */
export function getTimerProgressBarValue(currentTime, initialTime) {
  // convert both objects to hh:mm:ss string and initialize progressValue variable
  let currentTimeValue = `${currentTime.hs}:${currentTime.mins}:${currentTime.secs}`
  let initialTimeValue = `${initialTime.hs}:${initialTime.mins}:${initialTime.secs}`
  let progressValue = 0
  // get a Time (number) object for both values and substract them.
  // Assign the result to progressValue
  currentTimeValue = new Date("1970-01-01T" + currentTimeValue + "Z").getTime()
  initialTimeValue = new Date("1970-01-01T" + initialTimeValue + "Z").getTime()
  progressValue = initialTimeValue - currentTimeValue

  return [
    progressValue, // <number> : the substracted time (current progress) in ms
    currentTimeValue, // <number> : the elapsed time in ms
    initialTimeValue, // <number> : the initial time in ms
    currentTime, // <object> : current Time object as is
    initialTime // <object> : initial time object as is
  ]
}

/**
 * Gets a string and a character where we want to splice it. It returns an
 * array consisting of splitted strings, where "char" is placed as the last
 * character of each resulting string division but the last one.
 * E.g.: "Alicia, thanks for everything, love you!" where "char" is ',' will
 * return ["Alicia,", "thanks for everything,", "love you!"]
 * Basically, slice for strings passing a character instead of an index, and
 * applied to each instance of that character in the string.
 * @param {string} str The string to split
 * @param {string} char The character to split the string at
 */
export function divideStrByCharWithoutRemovingChar(str, char) {
  // if not chars were passed, return the string as is
  // if (char) return str
  // split the string
  const bruteFragments = str.split(char)
  const pureFragments = []
  // append each separation to pureFragments. All string pieces but the last
  // one will contain the character formerly used to split.
  for (let i = 0; i < bruteFragments.length; i++) {
    if (i === bruteFragments.length - 1) {
      pureFragments.push(bruteFragments[i])
    } else {
      pureFragments.push(bruteFragments[i] + char)
    }
  }
  // return the composed array
  return pureFragments
}

/**
 * A great if-chain to create the string to display as life points log when
 * life points are increased or decreased
 * @param {string} currentPlayer "p1" or "p2"
 * @param {string} condition "+" or "-"
 * @param {object} lpState LPReducer state. {p1: <number>, p2: <number>, tempLP: <string>}
 * @param {object} lpLimits Max and min in-game LP limits. {min: <number>, max: <number>}
 * @param {object} playerNames Player names object from PlayerContext {p1: <string>, p2: <string>}
 * @param {string} fixedButtonLPValue Strings of fixed buttons (-100, -500, -1000, 1/2)
 */
export function getLogDisplayText(
  currentPlayer,
  condition,
  lpState,
  lpLimits,
  playerNames,
  fixedButtonLPValue
) {
  // get the player name whose lifepoints were affected
  const player = playerNames[currentPlayer]
  // get the correct value of tempLP. If can be a integer string, or "1/2"
  const operationLP = fixedButtonLPValue ?? lpState.tempLP
  // get the integer to be added or substracted
  const deltaLP =
    operationLP === "1/2"
      ? Number.parseInt(-lpState[currentPlayer] / 2) // <int> = 1/2 player's current LP
      : condition === "-"
      ? -+operationLP // - <int> = lpState.tempLP or fixed button's value
      : +operationLP // + <int> = lpState.tempLP or fixed button's value
  // modifier to show at log string
  const modifier = condition === "+" ? "+" : ""
  // add or substract lp to show at log string
  let p2LP = currentPlayer === "p2" ? lpState.p2 + deltaLP : lpState.p2
  let p1LP = currentPlayer === "p1" ? lpState.p1 + deltaLP : lpState.p1
  // prevent any LP limits to be surpassed
  if (p1LP < lpLimits.min) p1LP = lpLimits.min
  if (p1LP > lpLimits.max) p1LP = lpLimits.max
  if (p2LP < lpLimits.min) p2LP = lpLimits.min
  if (p2LP > lpLimits.max) p2LP = lpLimits.max
  // finally, create the log string and return it
  return `[ ${p1LP} : ${p2LP} ]  ${player} ${modifier}${deltaLP} LP `
}

/**
 * Given player's saved decks Local Storage passed as a JS object, it transforms it to
 * an array, reconverts all hard coded "deck_<number>" keys to an ascending continuous
 * sequence of integers, and puts the object together again before returning it.
 * E.g.: A LS object with keys "deck_1", "deck_3", "deck_4" will assign "deck_3" as
 * the new "deck_2", and "deck_4" as "deck_3". Then, this new object is returned
 * @param {Object} LSObject RNMC-YCM-decks local storage JS object (converted from JSON to JS)
 */
export function sortLocalStorageAfterDeletingDeck(LSObject) {
  let sortedKeyValObject = {}

  sortedKeyValObject = Object.entries(
    LSObject[uiConfigs.localStorageDecksObjectKeys.decks]
  ).reduce((acc, keyValPair, i) => {
    const deckString = keyValPair[0].slice(0, 5)
    return deckString === "deck_"
      ? { ...acc, [deckString + (i + 1)]: keyValPair[1] }
      : acc
  }, {})

  if (!LSObject.deck_1) sortedKeyValObject.deck_1 = getStartingDeckSkeleton()

  return { [uiConfigs.localStorageDecksObjectKeys.decks]: sortedKeyValObject }
}

function valueToFixedZero(value) {
  return value.toFixed(0)
}

/**
 * Takes an array of arrays where each entry is a section type "xyz", "synchro", "monster",
 * "draw_5", "shuffle", plus the quantity of cards required. So, each entry is ["xyz", 5],
 * ["shuffle": 40], and maps them to return the text and extra styles needed two compute
 * DeckConstructorSidebar's inner components.
 * @param {Array} qtyArr Array of arrays containing all currEntries below
 * @param {Array} currEntry Array shape [<type string>, <card quantity by type>], like ["xyz", 1], or ["draw", 5]
 * @param {number} cardTotal Total amount of cards in qtyArray. Sum of all currEntry[1]
 * @param {boolean} isTestComponent "main", "side" and "extra" sections hold false, as "test" is true
 * @param {boolean} isMediaQueryPortrait Boolean to indicate we are in portrait view or not.
 */
export function getSVGImageTextAndExtraStyles(
  qtyArr,
  currEntry,
  cardTotal,
  isTestComponent,
  isMediaQueryPortrait
) {
  const text = isTestComponent // for "test" sidebar
    ? currEntry[0].includes("draw") // for "Draw 1" and "Draw 5" SVG components
      ? [
          `Draw ${[currEntry[1].amount]}`,
          `${cardTotal}>${
            // create "Draw <1|5>-<totalCards in fallback> > <totalCards in fallback - 1|5>"
            cardTotal - currEntry[1].amount > 0 // E.g.: "Draw 5-10>5", "Draw 1-40>39", "Draw 5-3>0"
              ? cardTotal - currEntry[1].amount // hyphen will be use to split the string
              : 0
          }`
        ]
      : // "shuffle" and "reset" options, on portrait resolution, should display the first
      // divided text as an empty space. This pushes the second down, aligning it better
      // for UI-UX purposes. On landscape, it's the other way round.
      isMediaQueryPortrait
      ? ["", currEntry[0][0].toUpperCase() + currEntry[0].slice(1)] // for "shuffle" and "reset", just return the capitalized string
      : [currEntry[0][0].toUpperCase() + currEntry[0].slice(1), ""]
    : // for "main", "side", "extra" sidebars, pass the amount and the percentage
      // over the total amount of cards in the section. Both in an array
      [
        currEntry[1], // amount of cards per type
        <AnimatedNumber // percentage of cards per type
          value={Math.round((currEntry[1] / cardTotal) * 100)}
          duration={250}
          formatValue={valueToFixedZero}
        />
      ]
  const extraStyles = isMediaQueryPortrait
    ? // given the case we are in portrait view, then apply no styles. Everything
      // should have the same geometry
      { containerStyle: null, textStyle: null }
    : // from here on, we are in landscape mode. Styles will be dynamically modified
    qtyArr.length > 3 // if there are more than 3 SVG images in any sidebar
    ? {
        containerStyle: {
          // divide width accordingly, and adjust a bit higher for "test" sidebar, as texts are larger
          width: `${(100 / qtyArr.length) * (isTestComponent ? 5 : 6)}%`
        },
        textStyle:
          qtyArr.length > 4 // for the text inside the SVG, if there are more than 4 svg images in the sidebar
            ? {
                fontSize: `${1.8 - 0.015 * qtyArr.length}vw`, // shrink it depending on the length
                top: "13%", // adjust the text lower so it does not interfere with the SVG image
                letterSpacing: `${0.14 - 0.02 * qtyArr.length}vw` // adjust letter spacing
              }
            : null // do nothing for sidebars with less than 4 components
      }
    : null // do nothing for sidebars with less than 3 components
  // return both text and styles in an array for the component to use
  return [text, extraStyles]
}
