import React from "react"
// import React, { lazy, Suspense } from "react"
import { Route, Switch, Redirect, withRouter } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import PropTypes from "prop-types"
import useAudio from "../../hooks/useAudio"
// import Spinner from "../../components/UI/Spinner/Spinner"
import openModalmp3 from "../../assets/audios/openModal.mp3"
import closeModalmp3 from "../../assets/audios/closeModal.mp3"
import uiConfigs from "../../utils/ui.configs.json"
import ErrorBoundary from "../../components/UI/ErrorBoundary/ErrorBoundary"
import GenericErrorMessage from "../../components/UI/GenericErrorMessage/GenericErrorMessage"
import LifePointsCounterPage from "../../pages/LifePointsCounterPage/LifePointsCounterPage"
import "./RouteComponents.module.css"
import LogPage from "../../pages/LogPage/LogPage"
import CardSearchPage from "../../pages/CardSearchPage/CardSearchPage"
import DeckBuilderPage from "../../pages/DeckBuilderPage/DeckBuilderPage"
import OptionsPage from "../../pages/OptionsPage/OptionsPage"

// I decided not to use lazy loading as this was supposed to be a PWA. Thus,
// it is better to load everything up front. You can enable it by uncommenting
// each this code below, the imports above and enabling <Suspense /> in return.
// You will also have to comment manual imports above.
//
// const LifePointsCounterPage = lazy(() =>
//   import("../../pages/LifePointsCounterPage/LifePointsCounterPage")
// )
// const LogPage = lazy(() => import("../../pages/LogPage/LogPage"))
// const CardSearchPage = lazy(() =>
//   import("../../pages/CardSearchPage/CardSearchPage")
// )
// const DeckBuilderPage = lazy(() =>
//   import("../../pages/DeckBuilderPage/DeckBuilderPage")
// )
// const OptionsPage = lazy(() => import("../../pages/OptionsPage/OptionsPage"))

function RouteComponents({
  fallbackRoute, // <string> the front element of pageArray in PageSwipe reducer
  slideClassName, // <string> current "swipe" className (left-slide or right-slide)
  uiContextObject, // <object> UIContext's passed object to consume as context
  swipe, // <function> App.js swipe callback function
  location // <object> location object passed by withRouter
}) {
  // useAudio JSX and audio controls object for <SecondaryScreen /> toggling sfx
  const [modalAudioJSX, modalSFX] = useAudio(openModalmp3, {
    toggleOn: uiContextObject.playSFXs,
    sources: [openModalmp3, closeModalmp3],
    playbackRate: 0.7
  })

  return (
    <>
      {/* uncaught errors triggered anywhere in the app will fall back here, rendering
    <GenericErrorMessage /> as a <SecondaryScreen /> component */}
      <ErrorBoundary
        {...uiContextObject}
        modalSFX={modalSFX}
        errorMessageComponent={GenericErrorMessage}
      >
        {/* TransitionGroup + CSSTransition combo wrapping Switch will add the proper
        slide classes route components to perform slide transitioning */}
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            timeout={250}
            classNames={slideClassName}
            component={null}
            mountOnEnter
            unmountOnExit
          >
            {/* <Suspense
                  fallback={
                    <div className={styles.SpinnerContainer}>
                      <Spinner classNames={classes.spinner} />
                    </div>
                  }
                > */}
            <Switch location={location}>
              <Route
                // page 0 is "/calc"
                path={`/${uiConfigs.pageNames[0]}`}
                render={() => (
                  <LifePointsCounterPage
                    {...uiContextObject}
                    modalSFX={modalSFX}
                  />
                )}
              />
              <Route
                // page 1 is "/log"
                path={`/${uiConfigs.pageNames[1]}`}
                render={() => (
                  <LogPage {...uiContextObject} modalSFX={modalSFX} />
                )}
              />
              <Route
                // page 2 is "/search"
                path={`/${uiConfigs.pageNames[2]}`}
                render={(routeProps) => (
                  <CardSearchPage
                    {...uiContextObject}
                    modalSFX={modalSFX}
                    {...routeProps}
                  />
                )}
              />
              <Route
                // page 3 is "/decks"
                path={`/${uiConfigs.pageNames[3]}`}
                render={() => (
                  <DeckBuilderPage
                    {...uiContextObject}
                    swipe={swipe}
                    modalSFX={modalSFX}
                  />
                )}
              />
              <Route
                // page 4 is "/configs"
                path={`/${uiConfigs.pageNames[4]}`}
                render={() => (
                  <OptionsPage {...uiContextObject} modalSFX={modalSFX} />
                )}
              />
              {/* fallback will always render the page at index 0 of pageArray 
              in pageSwipe reducer */}
              <Route render={() => <Redirect to={fallbackRoute} />} />
            </Switch>
          </CSSTransition>
          {/* </Suspense> */}
        </TransitionGroup>
      </ErrorBoundary>
      {modalAudioJSX}
    </>
  )
}

RouteComponents.propTypes = {
  fallbackRoute: PropTypes.string.isRequired,
  slideClassName: PropTypes.string.isRequired,
  uiContextObject: PropTypes.shape({
    secondScreenState: PropTypes.bool.isRequired,
    secondScreenType: PropTypes.string.isRequired,
    toggleSecondScreen: PropTypes.func.isRequired,
    playSFXs: PropTypes.bool.isRequired,
    togglePlaySFXs: PropTypes.func.isRequired
  }).isRequired,
  swipe: PropTypes.func.isRequired
}

export default withRouter(RouteComponents)

// const classes = {
//   spinner: {
//     container: [styles.Spinner]
//   }
// }
