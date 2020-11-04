import React from "react"
import CardListItem from "../CardListItem/CardListItem"
import MiniCircle from "../../UI/MiniCircle/MiniCircle"
import {
  getCardDefaultSection,
  getCardReverseSection
} from "../../../utils/yugiohSpecificFunctions"
import styles from "./DeckCreatorScreen.module.css"

export const classes = {
  deckBuilderTopScreen: [styles.DeckBuilderTopScreen],
  deckBuilderBottomScreen: [styles.DeckBuilderBottomScreen],
  miniCircle: {
    main: [styles.MiniCircle],
    side: [styles.MiniCircleSide],
    extra: [styles.MiniCircle] // intentional style repetiton. Check getCustomDeckSectionTitles()
  },
  selectionMenu: {
    container: [styles.SelectionMenuContainer],
    content: [styles.SelectionMenuContent]
  },
  deckCreatorSideBar: [styles.DeckCreatorSideBarContainer]
}

/**
 * Gets the return value of Object.entries() of the selected deck in the reducer
 * and returns an object in the shape of {section: [<CardListItem>, <CardListItem>...]}
 * @param {Array} deckSections Card sections entries, shape: [section: [cardObject, cardObject, ...]]
 * @param {string} deleteIcon Path string targetting the icon to use in delete MiniCircle
 * @param {string} arrowIcon The string pointing to the arrow icon svg image
 * @param {function} modifyQtyCallback Callback to assign to card quantity MiniCircle's onClick
 * @param {function} deleteItemCallback Callback to assign to delete card MiniCircle's onClick
 * @param {function} moveCardCallback Callback to assign to move (arrow) card MiniCircle's onClick
 * @param {function} showCardDetailsCallback Callback to assign to card info MiniCircle's onClick
 */
export function getCardListItemsJSXPerDeckSection(
  deckSections,
  deleteIcon,
  arrowIcon,
  modifyQtyCallback,
  deleteItemCallback,
  moveCardCallback,
  showCardDetailsCallback,
  cardCacheLength
) {
  return deckSections.reduce((acc, entry) => {
    // save the process in a variable. We might need to reverse it before returning it
    const cardListItemsJSXPerSection = {
      ...acc,
      // entry[0] is "main", "side", "extra" or "test". entry[1] the array with card objects
      [entry[0]]: entry[1].map((cardObj) => {
        // get the string of the section where the card normally belongs to
        const defaultCardSection = getCardDefaultSection(cardObj.type)
        // and the one where it should be moved to if switching sections
        const reverseCardSection = getCardReverseSection(cardObj.type, entry[0])
        // styles for the array to move to and from "side", "extra", "main"
        const arrowStyle =
          entry[0] === "main" ||
          (defaultCardSection === "extra" && entry[0] !== "extra")
            ? { transform: "rotate(180deg)" } // rotate if card belongs to extra deck
            : null
        // form the config object for the arrow svg component
        const arrowObj = {
          icon: arrowIcon,
          style: arrowStyle,
          alt: `Move to ${reverseCardSection}`,
          dataDestination: reverseCardSection
        }
        // for each card object in the section being reduced, return its JSX
        return (
          <CardListItem
            key={cardObj.reactKey ?? cardObj.name + reverseCardSection}
            isTestComponent={entry[0] === "test"}
            cardObj={cardObj}
            deleteIcon={deleteIcon}
            arrowObject={arrowObj}
            onModifyCardQuantity={modifyQtyCallback}
            onRemoveCardFromList={deleteItemCallback}
            onMoveCardBetweenSections={moveCardCallback}
            onShowCardDetails={showCardDetailsCallback}
            showCardDetails={!!cardCacheLength}
          />
        )
      })
    }
    // reverse the array corresponding to key 'test'. This gives the impression
    // to add cards to the top of list instead of the bottom when drawing
    if (entry[0] === "test") cardListItemsJSXPerSection[entry[0]].reverse()
    // return reduce() result up to this point
    return cardListItemsJSXPerSection
  }, {})
}

/**
 * Gets the return value of Object.entries() of the selected deck in the reducer
 * and returns an object in the shape of {section: <CustomTitleJSX />} to use
 * in SelectionMenuScreen component
 * @param {Array} deckSections Card sections' entries, shape: [section: [cardObject, cardObject, ...]]
 * @param {object} cardQuantityPerSection Card sections' card quantites, shape: {section: quantity}
 * @param {object} miniCircleClasses Card sections' title classes, shape {section: [className]}
 */
export function getCustomDeckSectionTitles(
  deckSections,
  cardQuantityPerSection,
  miniCircleClasses
) {
  // construct an array of all keys in deckSections (titles)
  const sectionTitles = deckSections.map((sectionArr) => sectionArr[0])
  // construct the target object to return
  return sectionTitles.reduce((acc, title) => {
    return {
      ...acc,
      [title]: (
        <>
          {/* title to show is capitalized */}
          {title[0].toUpperCase() + title.slice(1)}
          {/* deckSections.length - 1 is "Test" section, which does not use a MiniCircle */}
          {deckSections[deckSections.length - 1][0] !== title && (
            <MiniCircle
              display={cardQuantityPerSection[title]}
              animateOnDisplayChange
              classNames={miniCircleClasses[title]}
            />
          )}
        </>
      )
    }
  }, {})
}

/**
 * Gets the return value of Object.entries() of the selected deck in the reducer
 * and returns an object in the shape of {section: cardQuantityInSection}
 * @param {Array} deckSections Card sections entries, shape: [section: [cardObject, cardObject, ...]]
 */
export function getCardQuantityPerDeckSection(deckSections) {
  return deckSections.reduce((acc, entry) => {
    return {
      ...acc,
      [entry[0]]: entry[1].reduce(
        (currQty, cardObj) => currQty + cardObj.quantity,
        0
      )
    }
  }, {})
}
