import React, { memo, useCallback } from "react"
import PropTypes from "prop-types"
import useToggle from "../../../hooks/useToggle"
import MiniCircle from "../../UI/MiniCircle/MiniCircle"
import MiniCircleWithTransition from "../../UI/MiniCircleWithTransition/MiniCircleWithTransition"
import { getCardTypeStyle } from "../../../utils/yugiohSpecificFunctions"
import info from "../../../assets/uiIcons/info.svg"
import { classes } from "./CardListItem.utils"
import styles from "./CardListItem.module.css"

function CardListItem({
  isTestComponent, // <boolean> false renders all card options (modify, remove, switch sections, info)
  cardObj, // <object> card object containing "name", "type" and "quantity as keys"
  deleteIcon, // <string> path to "cross" delete icon's svg
  arrowObject, // <object> "switch section"'s arrow icon object (icon, alt, style and dataDestination as keys)
  onModifyCardQuantity, // <function> card quantity MiniCircle onClick's callback
  onRemoveCardFromList, // <function> remove card MiniCircle onClick's callback
  onMoveCardBetweenSections, // <function> "switch sections" MiniCircle onClick's callback
  onShowCardDetails, // <function> "i" (info) MiniCircle onClick's callback
  showCardDetails, // <boolean> on true, "i" MiniCircle will render
  classNames = {} // <object> classNames keys and values. Check them in propTypes below
}) {
  // state and toggler to control MiniCircles' rendering
  const [showMiniCircles, toggleMiniCircles] = useToggle(false)
  // spread cardObj into their own variables
  const { name, type, quantity } = cardObj

  const handleQuantityMiniCircleClick = useCallback(() => {
    // card object must bubble up, so pass it as args to function in props
    onModifyCardQuantity(cardObj)
  }, [onModifyCardQuantity])

  const handleDeleteMiniCircleClick = useCallback(() => {
    // same as handleDeleteMiniCircleClick, but for cardObj's "name"
    onRemoveCardFromList(name)
  }, [onRemoveCardFromList])

  const handleMoveCardMiniCircleClick = useCallback(() => {
    // same as above
    onMoveCardBetweenSections(cardObj.name, arrowObject.dataDestination)
  }, [onMoveCardBetweenSections])

  const handleInfoMiniCircleClick = useCallback(() => {
    // aaaaand, same
    onShowCardDetails(cardObj)
  }, [onShowCardDetails])

  return (
    <li
      style={{ color: getCardTypeStyle(type, 1) }}
      tabIndex={0}
      data-name={name}
      onBlur={toggleMiniCircles}
      onFocus={toggleMiniCircles}
      className={classes.container(classNames.container)}
    >
      {name}
      {
        // a <CardListItem /> component rendered in "Test" section will lack all
        // modifying MiniCircles, as we are not intended to change components in
        // any way there. We are to test them only
        !isTestComponent && (
          <>
            {showCardDetails && (
              <MiniCircleWithTransition
                triggerOn={showMiniCircles}
                display={
                  <img src={info} alt="card info" className={styles.InfoIcon} />
                }
                animateOnClick
                role="button"
                onClick={handleInfoMiniCircleClick}
                classNames={classes.infoMiniCircle(classNames.miniCircle)}
              />
            )}
            <MiniCircleWithTransition
              triggerOn={showMiniCircles && !!arrowObject}
              display={
                <img
                  src={arrowObject.icon}
                  alt={arrowObject.alt}
                  style={arrowObject.style}
                  className={styles.ArrowIcon}
                />
              }
              animateOnClick
              role="button"
              onClick={handleMoveCardMiniCircleClick}
              classNames={classes.arrowMiniCircle(classNames.arrowMiniCircle)}
            />
            <MiniCircleWithTransition
              triggerOn={showMiniCircles}
              display={
                <img
                  src={deleteIcon}
                  className={styles.DeleteIcon}
                  alt="Remove"
                />
              }
              animateOnClick
              role="button"
              onClick={handleDeleteMiniCircleClick}
              classNames={classes.deleteMiniCircle(classNames.deleteMiniCircle)}
            />
            <MiniCircle
              display={quantity}
              addNumberColorIndicator
              animateOnClick
              role="button"
              ariaLabel="Card quantity"
              onClick={handleQuantityMiniCircleClick}
              classNames={classes.miniCircle(classNames.miniCircle)}
            />
          </>
        )
      }
    </li>
  )
}

CardListItem.propTypes = {
  isTestComponent: PropTypes.bool.isRequired,
  cardObj: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  }),
  deleteIcon: PropTypes.string.isRequired,
  arrowObject: PropTypes.shape({
    icon: PropTypes.string,
    alt: PropTypes.string,
    style: PropTypes.object,
    dataDestination: PropTypes.string
  }),
  onModifyCardQuantity: PropTypes.func.isRequired,
  onRemoveCardFromList: PropTypes.func.isRequired,
  onMoveCardBetweenSections: PropTypes.func.isRequired,
  onShowCardDetails: PropTypes.func.isRequired,
  showCardDetails: PropTypes.bool.isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    miniCircle: PropTypes.arrayOf(PropTypes.string),
    deleteMiniCircle: PropTypes.arrayOf(PropTypes.string),
    arrowMiniCircle: PropTypes.arrayOf(PropTypes.string),
    infoMiniCircle: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(CardListItem)
