import React, { useContext, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import { DeckBuilderContext } from "../../../contexts/DeckBuilderContext"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import Toast from "../../UI/Toast/Toast"
import SecondaryScreen from "../../UI/SecondaryScreen/SecondaryScreen"
import DangerZoneSecondaryScreen from "../../../wrappers/DangerZoneSecondaryScreen/DangerZoneSecondaryScreen"
import { dangerZoneChildrenJSX } from "./DangerZoneSecondaryScreens.utils"
import uiConfigs from "../../../utils/ui.configs.json"
import styles from "./DangerZoneSecondaryScreens.module.css"

function DangerZoneSecondaryScreens({ modalSFX }) {
  // bring everything required to manipulate UI from UIContext
  const {
    toastState,
    dispatchToastAction,
    secondScreenState,
    secondScreenType,
    toggleSecondScreen,
    appIsLoadingSomething,
    setAppIsLoadingSomething,
    setScreenIsFrozen
  } = useContext(UIContext)
  // and card fetch objects and function to handle database re-fetching
  const { fetchCardList, cardFetchLastDate, setFetchCardsNewDate } = useContext(
    DeckBuilderContext
  )
  // save togglers in variables to dry code
  const cardRefetchToggler = uiConfigs.togglers.secondaryScreens.reloadCardList
  const resetAppToggler = uiConfigs.togglers.secondaryScreens.resetApp
  // we disable card fetching in UI if timeout from last re-fetch has not
  // expired at the time this component is rendered. If timeout was still not set
  // (cardFetchLastDate === null), then hard-code false, which enables re-fetch
  const isFetchCardsDisabled = cardFetchLastDate
    ? new Date() - new Date(cardFetchLastDate) <
      uiConfigs.apiConfigs.cardRefetchBlockTimeout
    : false

  const handleToggleToast = useCallback(() => {
    // Toast reducer action to force-close the toast
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  const handleFetchCards = useCallback(() => {
    // if card fetching "Proceed" <Button /> was pressed, close secondary screen
    toggleSecondScreen()
    // safeguard here. If by any means the <Button /> was enabled while it should
    // not have been (a bug or glitch), then just return out of the function
    if (isFetchCardsDisabled) return
    // from here on, we are successfully re-fetching cards. Toggle a <Toast /> to
    // notify the user to wait, and set the whole app into loading state
    dispatchToastAction(
      toastActionCreators.setToastState(
        "Retrieving cards from database. Please wait...",
        null,
        uiConfigs.togglers.toast.cardRefetch
      )
    )
    setAppIsLoadingSomething(true)
    // trigger useFetch()'s fetching function on the already set database url
    fetchCardList()
      .then(() => {
        // on fetch success, notify the user with a Toast, cancel the app's loading
        // state and assign a new date on localstorage to use as a timeout to
        // re-enable fetch option
        dispatchToastAction(
          toastActionCreators.setToastState(
            'Cards reloaded! Filter them in "Decks" section',
            null,
            uiConfigs.togglers.toast.cardRefetch
          )
        )
        setAppIsLoadingSomething(false)
        setFetchCardsNewDate()
      })
      .catch(() => {
        // on fetch fail, notify the user with a Toast and cancel the app's loading
        // state
        dispatchToastAction(
          toastActionCreators.setToastState(
            "Error loading cards. Please, try again later.",
            null,
            uiConfigs.togglers.toast.cardRefetch
          )
        )
        setAppIsLoadingSomething(false)
      })
  }, [
    fetchCardList,
    dispatchToastAction,
    setAppIsLoadingSomething,
    toggleSecondScreen
  ])

  const handleResetApp = useCallback(() => {
    // on app resetting "Proceed" <Button /> press, set global app loading state
    // to true and freeze swiping. Upon refreshing the app below, they will be
    // re-mounted, thus self-resetted to false
    setAppIsLoadingSomething(true)
    setScreenIsFrozen(true)
    // remove everything from local storage, which in term clears all saved data
    window.localStorage.clear()
    // set a temporary new key to true, which will flag App.js to trigger a Toast
    // upon reloading the page, notifying the user of a successful reset action
    window.localStorage.setItem(uiConfigs.localStorageResetKeyName, true)
    // finally, hard refresh the app. Doing so will re-mount it from root, resetting
    // all states and creating new default local storage keys
    window.location.reload()
  }, [setAppIsLoadingSomething, setScreenIsFrozen])

  return (
    <>
      <Toast
        show={
          // show <Toast /> on cardRefetch trigger. appReset <Toast /> will trigger
          // on App.js
          toastState.isActive &&
          toastState.type === uiConfigs.togglers.toast.cardRefetch
        }
        toggler={handleToggleToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveCardRefetch}
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
      >
        <div className={styles.ToastText}>{toastState.text}</div>
      </Toast>
      {secondScreenState &&
        (secondScreenType === cardRefetchToggler ||
          secondScreenType === resetAppToggler) && (
          <SecondaryScreen
            toggle={toggleSecondScreen}
            animation="fade"
            scrollable
            sfxObj={modalSFX}
          >
            {secondScreenType === cardRefetchToggler && (
              <DangerZoneSecondaryScreen
                onProceed={handleFetchCards}
                onCancel={toggleSecondScreen}
                // disable "Proceed" <Button /> if no internet connection of
                // if timeout from last re-fetch has not expired yet
                proceedDisabled={!navigator.onLine || isFetchCardsDisabled}
              >
                {
                  // children is a "render-props" function in <DangerZoneSecondaryScreen />
                  (incomingProps) =>
                    dangerZoneChildrenJSX.getRefetchCardsJSX(incomingProps)
                }
              </DangerZoneSecondaryScreen>
            )}
            {secondScreenType === resetAppToggler && (
              <DangerZoneSecondaryScreen
                onProceed={handleResetApp}
                onCancel={toggleSecondScreen}
                // disable "Proceed" <Button /> if global app state is loading (which
                // means we are re-fetching cards or we already clicked on reset app)
                proceedDisabled={appIsLoadingSomething}
              >
                {
                  // children is a "render-props" function in <DangerZoneSecondaryScreen />
                  (incomingProps) =>
                    dangerZoneChildrenJSX.getResetAppJSX(incomingProps)
                }
              </DangerZoneSecondaryScreen>
            )}
          </SecondaryScreen>
        )}
    </>
  )
}

DangerZoneSecondaryScreens.propTypes = {
  modalSFX: PropTypes.object.isRequired
}

export default memo(DangerZoneSecondaryScreens)
