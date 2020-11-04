import React, { memo, useEffect, useCallback, useRef } from "react"
import PropTypes from "prop-types"
import { CSSTransition } from "react-transition-group"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import Toast from "../../UI/Toast/Toast"
import OptionSwitchesCategory from "../../../wrappers/OptionSwitchesCategory/OptionSwitchesCategory"
import SVGImage from "../../UI/SVGImage/SVGImage"
import musicNote from "../../../assets/uiIcons/musicNote.svg"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./SFXSwitch.utils"
import styles from "./SFXSwitch.module.css"

function SFXSwitch({
  width, // <number> OptionSwitchesCategory's width
  switchSFX, // <object> useAudioControls object for switch toggle
  playSFXs, // <boolean> global ON/OFF boolean switch for audios
  togglePlaySFXs, // <function> global ON/OFF toggler function for sound effects
  toastState, // <object> <Toast /> reducer state in UIContext
  dispatchToastAction // <function> <Toast /> action dispatcher
}) {
  // isMounting ref will prevent <Toast /> sfx to play at mount phase
  const isMounting = useRef(true)

  const handleToggleSFXs = useCallback(() => {
    // the toast triggered for universal sound effect state here will have
    // a different format than the one on log switches, that's why we keep
    // its logic separated. This dispatch is used to clear toast state and
    // trigger the toast with nothing on it but {children} assigned in JSX
    dispatchToastAction(
      toastActionCreators.setToastState(
        "",
        null,
        uiConfigs.togglers.toast.sfxSwitch
      )
    )
    togglePlaySFXs()
  }, [dispatchToastAction, togglePlaySFXs])

  const handleToggleToast = useCallback(() => {
    // close <Toast /> action dispatcher to assign to "Dismiss" ("X")
    dispatchToastAction(toastActionCreators.closeToast())
  }, [dispatchToastAction])

  useEffect(() => {
    // do nothing at mount phase
    if (isMounting.current) isMounting.current = false
    // any other case, when master ON/OFF switch toggles, play the SFX only
    // if it is ON. We have to force play it since when state changes to
    // isOn = true, it will be queued, and thus too late for playSFX's listener
    // to catch it, missing the chance to play it on time.
    else if (!switchSFX.isOn) switchSFX.forcePlay()
  }, [playSFXs])

  return (
    <>
      <Toast
        show={
          toastState.isActive &&
          toastState.type === uiConfigs.togglers.toast.sfxSwitch
        }
        toggler={handleToggleToast}
        inactiveTimeout={uiConfigs.timeouts.toast.inactiveConfigsSwitches}
        refreshTimeoutOn={toastState.refreshTimeoutToggler}
      >
        <CSSTransition
          in={playSFXs}
          component={null}
          timeout={300}
          classNames="sfx-in-out"
        >
          <span className={classes.text(playSFXs)}>
            Sound Effects {playSFXs ? "ON" : "OFF"}
          </span>
        </CSSTransition>
      </Toast>
      <OptionSwitchesCategory width={width}>
        <div className={styles.Title}> SFX </div>
        <SVGImage
          src={musicNote}
          alt={`Sound effects ${playSFXs ? "ON" : "OFF"}`}
          type={`${playSFXs ? "primary" : "disabled"}`}
          role="button"
          ariaPressed={playSFXs}
          classNames={classes.svgImage(playSFXs)}
          onClick={handleToggleSFXs}
        />
      </OptionSwitchesCategory>
    </>
  )
}

SFXSwitch.propTypes = {
  width: PropTypes.number,
  switchSFX: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool.isRequired,
  togglePlaySFXs: PropTypes.func.isRequired,
  toastState: PropTypes.object.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}

export default memo(SFXSwitch)
