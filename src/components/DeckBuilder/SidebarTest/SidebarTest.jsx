import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  memo
} from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import * as deckConstructorActionCreators from "../../../store/DeckConstructor/deckConstructorActionCreators"
import SVGImageWithNotifications from "../../UI/SVGImageWithNotifications/SVGImageWithNotifications"
import { getSVGImageTextAndExtraStyles } from "../../../utils/utilityFunctions"
import { getSvg, getSvgImagesKeyValArr } from "./SidebarTest.utils"
// import styles from "./SidebarTest.module.css"

function SidebarTest({
  deckState, // <object> deckBuilder's reducer state
  dispatchDeckAction, // <function> deckBuilder's reducer action dispatcher
  isPortraitView, // <boolean> true if device is in orientation portrait
  drawSFX, // <object> useAudio() controls object for drawing cards sfx
  shuffleSFX, // <object> useAudio() controls object for shuffling deck sfx
  classNames // <object> classNames keys and values. Check them in propTypes below
}) {
  // state and setter to disable components (to let animation play with no interruptions)
  const [isClickDisabled, setIsClickDisabled] = useState(false)
  // we also need to freeze swipe to effectively disabled functionality
  const { setScreenIsFrozen } = useContext(UIContext)

  const triggerActionAndFreezeApp = useCallback(
    (actionDispatch) => {
      // if the component is not disabled, it is safe to dispatch the action and
      // to animate component. Disable it and fire the action
      if (!isClickDisabled) {
        setScreenIsFrozen(true)
        setIsClickDisabled(true)
        actionDispatch()
      }
    },
    [isClickDisabled, setScreenIsFrozen]
  )

  const handleDrawCard = useCallback(
    (e) => {
      // attempt to dispatch a drawTestCard reducer action and play a draw card sfx.
      // data-id is either "1" or "5", to let the reducer know how many
      // cards need to be drawn
      triggerActionAndFreezeApp(() => {
        dispatchDeckAction(
          deckConstructorActionCreators.drawTestCard(e.target.dataset.id)
        )
        drawSFX.restart()
      })
    },
    [dispatchDeckAction, triggerActionAndFreezeApp, drawSFX]
  )
  const handleShuffleOrReset = useCallback(
    (isShuffling) => {
      // attempt to dispatch n intitializeTestDeck reducer action and play a shuffle
      // deck sfx. If we clicked on "shuffle" SVG component, isShuffling will be true.
      // "Reset" SVG component will set isShuffling to false. The difference between
      // both is how they handle fallbackTestDeck and deckState[deck_key].test arrays.
      // "Shuffle" will clear fallbackTestDeck and fill deckState[deck_key].test, while
      // "Reset" does the other way round. Check reducer for further details
      triggerActionAndFreezeApp(() => {
        dispatchDeckAction(
          deckConstructorActionCreators.intitializeTestDeck(isShuffling)
        )
        shuffleSFX.restart()
      })
    },
    [dispatchDeckAction, shuffleSFX, triggerActionAndFreezeApp]
  )
  // create an array with set to all <SVGImageWithNotifications /> options as
  // first elements, and the values the component needs to render in an object
  // as second elements
  const svgImagesKeyValArr = getSvgImagesKeyValArr(
    deckState,
    handleDrawCard,
    handleShuffleOrReset
  )

  useEffect(() => {
    // when component freezes, fire a timeoo unfut treeze it. This timeout will
    // ensure the animations play with no interruptions
    const unfreezeApp = setTimeout(() => {
      setIsClickDisabled(false)
      setScreenIsFrozen(false)
    }, 300)
    return () => clearTimeout(unfreezeApp)
  }, [isClickDisabled, setScreenIsFrozen])

  return (
    <>
      {
        // map the constructed array to create <SVGImageWithNotifications /> for
        // each "test" option with their static or dynamic texts
        svgImagesKeyValArr.map((keyValArr) => {
          const [textArr, extraStyles] = getSVGImageTextAndExtraStyles(
            svgImagesKeyValArr,
            keyValArr,
            deckState.fallbackTestDeck.length,
            true,
            isPortraitView
          )
          // get the respective background SVG image
          const svgImg = getSvg(keyValArr[0])
          // and their particular enabled/disabled state
          const isDisabled = isClickDisabled || keyValArr[1].disabled
          return (
            <SVGImageWithNotifications
              key={keyValArr[0]}
              dataId={keyValArr[1].amount} // "1" or "5" to pass to handleDrawCard()
              src={svgImg}
              alt={keyValArr[0]}
              text={
                <>
                  {textArr[0]} <br /> {textArr[1]}
                </>
              }
              onClick={isDisabled ? null : keyValArr[1].onClick}
              disabled={isDisabled}
              containerStyle={extraStyles?.containerStyle}
              textStyle={extraStyles?.textStyle}
              classNames={classNames[keyValArr[0]]}
            />
          )
        })
      }
    </>
  )
}

SidebarTest.propTypes = {
  deckState: PropTypes.object.isRequired,
  dispatchDeckAction: PropTypes.func.isRequired,
  isPortraitView: PropTypes.bool.isRequired,
  drawSFX: PropTypes.object.isRequired,
  shuffleSFX: PropTypes.object.isRequired,
  classNames: PropTypes.objectOf(
    PropTypes.shape({
      container: PropTypes.arrayOf(PropTypes.string),
      image: PropTypes.arrayOf(PropTypes.string),
      text: PropTypes.arrayOf(PropTypes.string)
    })
  )
}

export default memo(SidebarTest)
