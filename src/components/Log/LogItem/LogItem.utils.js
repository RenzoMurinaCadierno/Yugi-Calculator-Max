import { divideStrByCharWithoutRemovingChar } from "../../../utils/utilityFunctions"

/**
 * Splits the upcoming Log Items (dice, lifepoints, coin, timer), and returns
 * the divided fragments in an array to be mapped as individual <span>s
 * @param {string} str The log type string
 * @param  {...string} chars the characters to divide the log string: ']', '-', '+', 'at'
 */
export function divideLogString(str, ...chars) {
  // flatten the incoming array of arrays into only one array with all chars in it
  const charsFlat = chars.flat()
  // divide as normal for the first time
  const firstDivision = divideStrByCharWithoutRemovingChar(str, charsFlat[0])
  // lifepoints logs are the only ones with more than one character (length > 1).
  // They will always be in the order ['-', '+']
  if (charsFlat.length > 1) {
    let secondDivision
    // if the character is '-', separate the string, add the char to the
    // last string and create a new log type array to return
    if (firstDivision[1].indexOf(charsFlat[1]) !== -1) {
      secondDivision = firstDivision[1].split(charsFlat[1])
      secondDivision[1] = charsFlat[1] + secondDivision[1]
      return [firstDivision[0], ...secondDivision]
      // same for '+', it is the second character
    } else if (firstDivision[1].indexOf(charsFlat[2]) !== -1) {
      secondDivision = firstDivision[1].split(charsFlat[2])
      secondDivision[1] = charsFlat[2] + secondDivision[1]
      return [firstDivision[0], ...secondDivision]
    }
  }
  // dice, coin, timer and "restart" lifepoints logs will only return the
  // first splitted string
  return firstDivision
}
