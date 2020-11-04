import React from "react"
import PropTypes from "prop-types"
import SearchScreen from "../../components/CardSearch/SearchScreen/SearchScreen"
import SearchMenu from "../../components/CardSearch/SearchMenu/SearchMenu"
import styles from "./CardSearchPage.module.css"
import SecondaryScreens from "../../components/CardSearch/SecondaryScreens/SecondaryScreens"

export default function CardSearchPage({
  toggleSecondScreen, // <function> UIContext's secondary screen toggler
  secondScreenState, // <boolean> UIContext's secondary screen state
  secondScreenType, // <string> UIContext's secondary screen type
  toastState, // <oblject> UIContext's <Toast /> reducer state
  dispatchToastAction, // <function> UIContext's <Toast /> action dispatcher
  screenIsFrozen, // <boolean> UIContext's boolean state to freeze swiping
  setScreenIsFrozen, // <function> UIContext's swipe-freezing toggler
  modalSFX, // <object> useAudio()'s controls for secondary screen toggling sfx
  playSFXs // <boolean> global ON/OFF sfx switch
}) {
  return (
    <>
      <SecondaryScreens
        toggleSecondScreen={toggleSecondScreen}
        secondScreenState={secondScreenState}
        secondScreenType={secondScreenType}
        modalSFX={modalSFX}
        playSFXs={playSFXs}
      />
      <main className={styles.Container}>
        <SearchScreen
          playSFXs={playSFXs}
          toastState={toastState}
          dispatchToastAction={dispatchToastAction}
          toggleSecondScreen={toggleSecondScreen}
          secondScreenState={secondScreenState}
        />
        <SearchMenu
          secondScreenState={secondScreenState}
          toggleSecondScreen={toggleSecondScreen}
          setScreenIsFrozen={setScreenIsFrozen}
          screenIsFrozen={screenIsFrozen}
          dispatchToastAction={dispatchToastAction}
        />
      </main>
    </>
  )
}

CardSearchPage.propTypes = {
  toggleSecondScreen: PropTypes.func.isRequired,
  secondScreenState: PropTypes.bool.isRequired,
  secondScreenType: PropTypes.string.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  screenIsFrozen: PropTypes.bool.isRequired,
  setScreenIsFrozen: PropTypes.func.isRequired,
  modalSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
