import React from "react"
import PropTypes from "prop-types"
import SVGImageWithNotifications from "../../UI/SVGImageWithNotifications/SVGImageWithNotifications"
import card from "../../../assets/uiIcons/card.svg"
import { getSVGImageTextAndExtraStyles } from "../../../utils/utilityFunctions"
import { getCardQuantityPerTypeAndCardQuantityTotal } from "./SidebarMainSideExtra.utils"
// import styles from "./SidebarMainSideExtra.module.css"

export default function SidebarMainSideExtra({
  deckState, // <object> deckBuilder's reducer state
  isPortraitView, // <boolean> true if device is held in orientation portrait
  classNames // <object> classNames keys and values. Check them in propTypes below
}) {
  // target the active -selected- section ("main", "side", "extra") of the active
  // deck in state (deck_<id>)
  const currentSection =
    deckState[`deck_${deckState.selectedDeckId}`][deckState.selectedDeckSection]
  // get an object with keys equal to the first word in the card type, and value
  // equal to the total quantity of cards in the section with that type.
  // Also, the total amount of cards in the section to calculate percentages.
  // Check getCardQuantityPerTypeAndCardQuantityTotal() comments for further details.
  const [
    cardQuantitiesObj,
    totalAmountOfCards
  ] = getCardQuantityPerTypeAndCardQuantityTotal(currentSection)
  // convert cardQuantitiesObj's keys and values into an array of entries
  const cardQuantitiesArray = Object.entries(cardQuantitiesObj)

  return (
    <>
      {
        // map the constructed array to create <SVGImageWithNotifications /> for
        // each card type with their quantities and percentages over the total
        // amount of cards
        cardQuantitiesArray.map((typeAndQtyEntry) => {
          const [textArr, extraStyles] = getSVGImageTextAndExtraStyles(
            cardQuantitiesArray,
            typeAndQtyEntry,
            totalAmountOfCards,
            false,
            isPortraitView
          )
          return (
            <SVGImageWithNotifications
              key={typeAndQtyEntry[0]}
              src={card}
              alt={`${typeAndQtyEntry[0]} card ratio`}
              text={
                <>
                  {textArr[0]} <br /> ({textArr[1]}%)
                </>
              }
              containerStyle={extraStyles?.containerStyle}
              textStyle={extraStyles?.textStyle}
              classNames={classNames[typeAndQtyEntry[0]]}
            />
          )
        })
      }
    </>
  )
}

SidebarMainSideExtra.propTypes = {
  deckState: PropTypes.shape({
    selectedDeckSection: PropTypes.string,
    selectedDeckId: PropTypes.number
  }),
  isPortraitView: PropTypes.bool.isRequired,
  classNames: PropTypes.objectOf(
    PropTypes.shape({
      container: PropTypes.arrayOf(PropTypes.string),
      image: PropTypes.arrayOf(PropTypes.string),
      text: PropTypes.arrayOf(PropTypes.string)
    })
  )
}
