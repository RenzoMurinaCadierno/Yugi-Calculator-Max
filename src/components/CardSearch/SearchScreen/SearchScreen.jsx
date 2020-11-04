import React, { useContext, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { CardSearchContext } from "../../../contexts/CardSearchContext"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import useAudio from "../../../hooks/useAudio"
import Toast from "../../UI/Toast/Toast"
import ImgScreen from "../ImgScreen/ImgScreen"
import DescPriceScreen from "../DescPriceScreen/DescPriceScreen"
import ListScreen from "../ListScreen/ListScreen"
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon"
import toastmp3 from "../../../assets/audios/toast.mp3"
import swipemp3 from "../../../assets/audios/swipe.mp3"
import styles from "./SearchScreen.module.css"
import { classes, toastJSXs } from "./SearchScreen.utils"
import uiConfigs from "../../../utils/ui.configs.json"

export default function SearchScreen({
  secondScreenState, // <boolean> second screen state toggled ON/OFF
  toggleSecondScreen, // <function> second screen state toggler
  toastState, // <object> toastState reducer state
  dispatchToastAction, // <function> toast reducer action dispatcher
  playSFXs // <boolean> universal sound effect's ON/OFF state
}) {
  // several states and actions from CardSearch reducer are consumed here
  const { searchReducer, dispatchSearchAction } = useContext(CardSearchContext)
  const {
    isInListScreen,
    isLoading,
    currentCard,
    currentList,
    filterableList
  } = searchReducer
  // audio SFX and object to swipe between card and list components
  const [swipeAudioSFX, swipeSFX] = useAudio(swipemp3, { toggleOn: playSFXs })
  // audio SFX and object to toggle toast
  const [toastAudioJSX, toastSFX] = useAudio(toastmp3, {
    toggleOn: playSFXs,
    playbackRate: 1.2
  })

  const handleArrowIconClick = useCallback((e) => {
    // when clicking on card or list arrows, dispatch the actions to
    // render the correct component
    swipeSFX.restart()
    if (e.target.dataset.id === "left") {
      dispatchSearchAction(cardSearchActionCreators.displayListScreen())
    } else {
      dispatchSearchAction(cardSearchActionCreators.displayCardScreen())
    }
  })

  const handleCloseToast = useCallback(() => {
    // close action dispatch to assign to <Toast />'s "X" dismiss icon
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  const handleToastLinkClick = useCallback(() => {
    // on card image <Toast />'s link click, dispatch the action to set the
    // img url and toggle its secondary screen. Image will load there
    if (toastState.type === uiConfigs.togglers.toast.cardImgScreen) {
      const { images } = currentCard.data
      images &&
        images[0] &&
        dispatchSearchAction(
          cardSearchActionCreators.setAltImgId(images[0].id.toString())
        )
      if (!secondScreenState)
        toggleSecondScreen(uiConfigs.togglers.secondaryScreens.altCardArt)
      // on retailer site's <Toast /> link click, just open the reailer url
      // in a new window
    } else if (toastState.type === uiConfigs.togglers.toast.retailerSite) {
      window.open(toastState.url, "_blank", "noopener, noreferrer")
    }
    // on both cases, close the toast
    handleCloseToast()
  }, [
    toastState.type,
    toastState.url,
    handleCloseToast,
    dispatchSearchAction,
    toggleSecondScreen,
    secondScreenState
  ])

  // to get the correct JSX to show on <Toast />, use the functions assigned to
  // toastJSXs object in utilityObject.js
  const toastJSX = toastJSXs[toastState.type]?.(
    toastState,
    classes[toastState.type],
    handleToastLinkClick
  )

  useEffect(() => {
    // when Toast triggers, play its SFX. Avoid this if we are coming from
    // <DeckBuilder />, as toast would be already opened by then
    toastState.isActive &&
      toastState.type !== uiConfigs.togglers.toast.cardInfo &&
      toastSFX.play()
    // if this component mounts due to card info being requested from <DeckBuilder />
    // just re-trigger toast to warn the user of possibly outdated prices
    toastState.type === uiConfigs.togglers.toast.cardInfo &&
      dispatchToastAction(
        toastActionCreators.setToastState(
          "Prices updated the last time you opened the app.",
          "Warning!",
          uiConfigs.togglers.toast.cardInfoWarning
        )
      )
  }, [toastState.isActive, toastSFX])

  return (
    <>
      {/* individual <Toast /> for this page */}
      <Toast
        show={toastState.isActive}
        toggler={handleCloseToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveCardImage}
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
      >
        <div className={styles.ToastText}>{toastJSX}</div>
      </Toast>
      {/* "visible" JSX from here on */}
      <section className={styles.Container}>
        {/* if we are in card detail and price screen, and a valid card object 
        is loaded in state, render components for the card image and details/prices */}
        {!isInListScreen && currentCard && currentCard.data && (
          <>
            <ImgScreen
              src={currentCard.img}
              images={currentCard.data.images}
              dispatchSearchAction={dispatchSearchAction}
              playSFXs={playSFXs}
            />
            <DescPriceScreen
              currentCard={currentCard}
              currentList={currentList}
              dispatchSearchAction={dispatchSearchAction}
            />
            <ArrowIcon
              component="nav"
              pointing="left"
              isClickable
              extraText="List"
              alt="Go to search results list"
              role="navigation"
              dataId="left"
              onClick={handleArrowIconClick}
              classNames={classes.arrowLeft}
            />
          </>
        )}
        {/* if we are sitting in card list screen instead, render the component
        that displays all card objects for the user to choose from */}
        {isInListScreen && (
          <>
            <ListScreen
              isLoading={isLoading}
              currentCard={currentCard}
              filterableList={filterableList}
              dispatchSearchAction={dispatchSearchAction}
            />
            <ArrowIcon
              component="nav"
              pointing="right"
              isClickable
              extraText="Card"
              disabled={isLoading || !Object.keys(currentCard.data).length}
              alt={`Go to searched card details${
                isLoading || !Object.keys(currentCard.data).length
                  ? " (disabled)"
                  : ""
              }`}
              role="navigation"
              dataId="right"
              onClick={handleArrowIconClick}
              classNames={classes.arrowRight}
            />
          </>
        )}
        {swipeAudioSFX}
        {toastAudioJSX}
      </section>
    </>
  )
}

SearchScreen.propTypes = {
  secondScreenState: PropTypes.bool.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
