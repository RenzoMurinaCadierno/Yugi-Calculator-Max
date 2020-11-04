import React, { useEffect, useContext, useState } from "react"
import PropTypes from "prop-types"
import { CardSearchContext } from "../../../contexts/CardSearchContext"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import SecondaryScreen from "../../UI/SecondaryScreen/SecondaryScreen"
import ErrorMessage from "../../../wrappers/ErrorMessage/ErrorMessage"
import SelectionMenuScreen from "../../UI/SelectionMenuScreen/SelectionMenuScreen"
import AltArtImgDisplay from "../AltArtImgDisplay/AltArtImgDisplay"
import {
  errorMessages,
  secondaryScreensData
} from "../../../utils/utilityObjects"
import uiConfigs from "../../../utils/ui.configs.json"

export default function SecondaryScreens({
  toggleSecondScreen, // <function> UIContext's secondary screen toggler
  secondScreenState, // <boolean> UIContext's secondary screen state
  secondScreenType, // <string> UIContext's secondary screen type
  playSFXs, // <boolean> global ON/OFF sfx switch
  modalSFX // <object> useAudio()'s controls for secondary screen toggling sfx
}) {
  // grab reducer state and action dispatcher from CardSearchContext
  const { searchReducer, dispatchSearchAction } = useContext(CardSearchContext)
  // flag to stop first useEffect from triggering endlessly if there is no internet
  // connection
  const [hasWarnedOfNoConnection, setHasWarnedOfNoConnection] = useState(false)
  // shorthand to avoid code repetition
  const togglers = uiConfigs.togglers.secondaryScreens
  // save secondary screen types match as boolean. They will trigger the correct
  // <SecondaryScreen /> depeding on the type
  const isNoInternetConnectionScreen =
    secondScreenType === togglers.noInternetConnection
  const isSearchErrorScreen = secondScreenType === togglers.cardSearchError
  const isSearchTipsScreen = secondScreenType === togglers.searchTips
  const isAltCardArtScreen = secondScreenType === togglers.altCardArt

  useEffect(() => {
    // at mount, if the user is not connected to internet, they will not be able to
    // search for cards. So, warn them instantly. Also, set the connection flag to
    // true so that this useEffect does not trigger again on next renders
    if (!navigator.onLine && !hasWarnedOfNoConnection) {
      toggleSecondScreen(togglers.noInternetConnection)
      setHasWarnedOfNoConnection(true)
    }
  }, [toggleSecondScreen, togglers.noInternetConnection])

  useEffect(() => {
    // on an unsuccessful search (flagged by hasError state in reducer), notify the
    // user and clear reducer's search state (clear error state)
    if (searchReducer.hasError) {
      toggleSecondScreen(togglers.cardSearchError)
      dispatchSearchAction(cardSearchActionCreators.resetFetchState())
    }
  }, [searchReducer.hasError, toggleSecondScreen, dispatchSearchAction])

  return (
    <>
      {secondScreenState && (
        <>
          <SecondaryScreen
            toggle={toggleSecondScreen}
            small={isSearchErrorScreen || isNoInternetConnectionScreen}
            scrollable={isSearchTipsScreen || isAltCardArtScreen}
            animation="translateDown"
            sfxObj={modalSFX}
          >
            {
              // mount phase "no internet connection" Secondary Screen
              isNoInternetConnectionScreen && (
                <ErrorMessage>
                  {errorMessages.noInternetConnection}
                </ErrorMessage>
              )
            }
            {
              // unsuccessful search Secondary Screen
              isSearchErrorScreen && (
                <ErrorMessage> {errorMessages.cardSearchError} </ErrorMessage>
              )
            }
            {
              // "Tips" search <Button /> Secondary Screen
              isSearchTipsScreen && (
                <SelectionMenuScreen
                  items={secondaryScreensData.searchTips.items}
                  playSFXs={playSFXs}
                />
              )
            }
            {
              // card image Secondary Screen
              isAltCardArtScreen && (
                <AltArtImgDisplay altImgId={searchReducer.altImgId} />
              )
            }
          </SecondaryScreen>
        </>
      )}
    </>
  )
}

SecondaryScreens.propTypes = {
  secondScreenType: PropTypes.string.isRequired,
  secondScreenState: PropTypes.bool.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  modalSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
