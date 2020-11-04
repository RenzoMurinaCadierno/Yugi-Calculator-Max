import React, {
  useState,
  useContext,
  useEffect,
  memo,
  useCallback
} from "react"
import { withRouter } from "react-router-dom"
import { Swipeable } from "react-swipeable"
import { UIContext } from "./contexts/UIContext"
import * as pageSwipeActionCreators from "./store/PageSwipe/pageSwipeActionCreators"
import * as toastActionCreators from "./store/Toast/toastActionCreators"
import useAudio from "./hooks/useAudio"
import RouteComponents from "./wrappers/RouteComponents/RouteComponents"
import Toast from "./components/UI/Toast/Toast"
import Spinner from "./components/UI/Spinner/Spinner"
import uiConfigs from "./utils/ui.configs.json"
import swipemp3 from "./assets/audios/swipe.mp3"
import { classes, getNavigationArrowJSX } from "./App.utils"
import styles from "./App.module.css"

function App({ history }) {
  // bring the whole context object being provided by UIContext
  const uiContextObject = useContext(UIContext)
  // get pageArray and slide className from pageState
  const { pageArray, slide } = uiContextObject.pageState
  // state and setter to prevent the user from swiping
  const [isSwipeFrozen, setIsSwipeFrozen] = useState(false)
  // audio JSX and controls object for swiping sfx
  const [swipeAudioJSX, swipeSFX] = useAudio(swipemp3, {
    toggleOn: uiContextObject.playSFXs
  })

  const onArrowClick = useCallback(
    // when clicking on arrows to move from component to component, trigger swipe()
    (e) => {
      swipe(e.target.dataset.id)
    },
    [swipe]
  )

  const handleCloseToast = useCallback(() => {
    // toast action dispatcher to force-close it
    uiContextObject.dispatchToastAction(toastActionCreators.closeToast())
  }, [uiContextObject.dispatchToastAction])

  function swipe(direction) {
    // if user should not swipe, or should not click on anything or any secondary
    // screen is toggled on, swiping will do nothing
    if (
      uiContextObject.secondScreenState ||
      uiContextObject.screenIsFrozen ||
      isSwipeFrozen
    ) {
      return
    }
    // from here on, swipe was triggered. Freeze further swiping actions
    setIsSwipeFrozen(true)
    // sync page state with the page to be loaded due to swiping
    uiContextObject.dispatchPageAction(
      pageSwipeActionCreators[
        `${direction === "left" ? "goForward" : "goBack"}`
      ]()
    )
    // push history to render the component the user swiped for
    history.push(
      direction === "left" ? pageArray[1] : pageArray[pageArray.length - 1]
    )
    // play a swipe sfx and force-close opened <Toast />s, if any
    swipeSFX.play()
    handleCloseToast()
  }

  useEffect(() => {
    // mounting the app from any path besides root ('/') triggers this useEffect,
    // which sync's pageArray to the current loaded path
    history.location.pathname &&
      uiContextObject.dispatchPageAction(
        pageSwipeActionCreators.syncStartingURLwithPageArray(
          history.location.pathname
        )
      )
  }, [])

  useEffect(() => {
    // at any time app swiping action freezes, set a timeout to unfreeze it.
    // This is such so that state in reducer, UI and sfx can all play with no
    // interruptions
    const freezeSwipeTimeout = setTimeout(() => {
      setIsSwipeFrozen(false)
    }, uiConfigs.timeouts.freezeSwipe)
    return () => freezeSwipeTimeout && clearTimeout(freezeSwipeTimeout)
  }, [isSwipeFrozen])

  useEffect(() => {
    // on mount, look for "resetApp" local storage item
    const appWasResetted = window.localStorage.getItem(
      uiConfigs.localStorageResetKeyName
    )
    // if it exists, it means the app was hard refreshed and thus re-mounted due
    // to the user having resetted it from "Danger Zone" in "configs" page.
    // Remove that local storage flag so this does not trigger on further mounts,
    // and toggle the <Toast /> here to notify the user of a successful reset.
    if (appWasResetted) {
      window.localStorage.removeItem(uiConfigs.localStorageResetKeyName)
      uiContextObject.dispatchToastAction(
        toastActionCreators.setToastState(
          "App resetted successfully!",
          null,
          uiConfigs.togglers.toast.appReset
        )
      )
    }
  }, [uiContextObject.dispatchToastAction])

  return (
    <Swipeable
      onSwipedRight={() => swipe("right")}
      onSwipedLeft={() => swipe("left")}
      delta={uiConfigs.swipeDelta}
      className={styles.App}
    >
      {
        // if anywhere in this app appIsLoadingSomething === true, a <Spinner />
        // is shown on the top-right side of the screen
        uiContextObject.appIsLoadingSomething && (
          <Spinner classNames={classes.spinner} />
        )
      }
      <Toast
        show={
          uiContextObject.toastState.isActive &&
          uiContextObject.toastState.type === uiConfigs.togglers.toast.appReset
        }
        toggler={handleCloseToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveAppReset}
      >
        <div className={styles.ToastText}>
          {uiContextObject.toastState.text}
        </div>
      </Toast>
      {getNavigationArrowJSX(
        "left",
        pageArray[1],
        uiContextObject.screenIsFrozen,
        onArrowClick
      )}
      {getNavigationArrowJSX(
        "right",
        pageArray[pageArray.length - 1],
        uiContextObject.screenIsFrozen,
        onArrowClick
      )}
      <RouteComponents
        uiContextObject={uiContextObject}
        fallbackRoute={pageArray[0]}
        slideClassName={slide}
        swipe={swipe}
      />
      {swipeAudioJSX}
    </Swipeable>
  )
}

export default memo(withRouter(App))
