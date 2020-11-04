import React, { useCallback } from "react"
import PropTypes from "prop-types"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import useAudio from "../../../hooks/useAudio"
import Toast from "../../UI/Toast/Toast"
import SecondaryScreen from "../../UI/SecondaryScreen/SecondaryScreen"
import SelectionMenuScreen from "../../UI/SelectionMenuScreen/SelectionMenuScreen"
import ExpandableIcon from "../../UI/ExpandableIcon/ExpandableIcon"
import {
  socialMediaSites,
  cardAndPricesDatabaseSites,
  acknowledgmentsSites,
  secondaryScreensData
} from "../../../utils/utilityObjects"
import uiConfigs from "../../../utils/ui.configs.json"
import togglermp3 from "../../../assets/audios/toggler.mp3"
import { classes } from "./SecondaryScreens.utils"
import styles from "./SecondaryScreens.module.css"

export default function SecondaryScreens({
  creditsScreens,
  secondScreenState,
  secondScreenType,
  toggleSecondScreen,
  toastState,
  dispatchToastAction,
  playSFXs,
  modalSFX
}) {
  // grab all keys to use as titles for each <SelectionMenuScreen />
  const socialMediaIcons = Object.keys(socialMediaSites)
  const acknowledgmentsIcons = Object.keys(acknowledgmentsSites)
  const cardAndPricesSites = Object.values(cardAndPricesDatabaseSites)
  // save togglers into their own variables to dry code
  const contactToggler = secondaryScreensData.credits.contact.toggler
  const databaseToggler = secondaryScreensData.credits.database.toggler
  const acknowledgementsToggler =
    secondaryScreensData.credits.acknowledgments.toggler
  // JSX and audio controls for expandable icon clicking sfx
  const [expIconAudioJSX, expIconSFX] = useAudio(togglermp3, {
    toggleOn: playSFXs,
    playbackRate: 0.6
  })

  const handleToastClick = useCallback(
    (e) => {
      // <Toast /> state setter in reducer to pass as parameter to divContent()
      // on each social media object's functions in utilityObjects.js
      dispatchToastAction(
        toastActionCreators.setToastState(
          e.target.dataset.text,
          e.target.dataset.url,
          uiConfigs.togglers.toast.creditSites
        )
      )
    },
    [dispatchToastAction]
  )

  const handleToggleToast = useCallback(() => {
    // close <Toast /> action dispatch to assign to toast Dismiss "X"
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  const getExpandableIconsArray = useCallback(
    (siteNamesArray, siteNamesObject, large = false) => {
      // map each site name string into their own <ExpandableIcon />
      return siteNamesArray.map((site, i) => (
        <ExpandableIcon
          key={site}
          siteObject={siteNamesObject}
          site={site}
          tabIndex={i + 1}
          expIconSFX={expIconSFX}
          classNames={classes.expandableIcon(site, large)}
        >
          {
            // "siteNamesObject" is an object in utilityObjects.js, and "site"s
            // are its keys. Each of those keys have "divContent" as a function
            // that returns JSX to render as children of <ExpandableIcon />
            siteNamesObject[site].divContent(handleToastClick)
          }
        </ExpandableIcon>
      ))
    },
    [expIconSFX.isOn, handleToastClick]
  )

  return (
    <>
      <Toast
        show={
          toastState.isActive &&
          toastState.type === uiConfigs.togglers.toast.creditSites
        }
        toggler={handleToggleToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveCreditsOptions}
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
      >
        {/* children of <Toast /> are links to the assign toastState.url of
        whatever JSX rendered it */}
        <a
          href={toastState.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ToastBody}
        >
          Click to open
          <span className={styles.ToastHref}>{toastState.text}</span>
          in a new tab.
        </a>
      </Toast>
      {
        // each credit screen will have its own <SecondaryScreen /> triggered
        // by its own toggler
        creditsScreens.map(
          (ss, i) =>
            secondScreenType === ss[1].toggler &&
            secondScreenState && (
              <SecondaryScreen
                key={i}
                toggle={toggleSecondScreen}
                scrollable
                animation="fade"
                sfxObj={modalSFX}
                onClose={handleToggleToast}
              >
                {/* that <SecondaryScreen /> consist of a <SelectionMenuScreen /> */}
                <SelectionMenuScreen
                  items={ss[1].items}
                  playSFXs={playSFXs}
                  classNames={{
                    content:
                      ss[1].toggler === contactToggler ||
                      ss[1].toggler === acknowledgementsToggler
                        ? [styles.ContactContent]
                        : []
                  }}
                />
                {/* and <ExpandableIcons /> or trailing <div>s depending on the
              toggler active at the time */}
                {ss[1].toggler === contactToggler &&
                  getExpandableIconsArray(socialMediaIcons, socialMediaSites)}
                {ss[1].toggler === databaseToggler && (
                  <div className={styles.CardAndPricesSites}>
                    {cardAndPricesSites.map((site, i) => (
                      <span
                        key={i}
                        data-url={site.href}
                        data-text={site.name}
                        onClick={handleToastClick}
                        className={styles.CardSite}
                      >
                        {site.name}
                      </span>
                    ))}
                  </div>
                )}
                {ss[1].toggler === acknowledgementsToggler &&
                  getExpandableIconsArray(
                    acknowledgmentsIcons,
                    acknowledgmentsSites,
                    true
                  )}
              </SecondaryScreen>
            )
        )
      }
      {expIconAudioJSX}
    </>
  )
}

SecondaryScreens.propTypes = {
  creditsScreens: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired,
  secondScreenState: PropTypes.bool.isRequired,
  secondScreenType: PropTypes.string.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  modalSFX: PropTypes.object.isRequired
}
