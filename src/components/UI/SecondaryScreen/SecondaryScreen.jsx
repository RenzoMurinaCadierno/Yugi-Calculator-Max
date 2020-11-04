import React, { useState, useCallback, useEffect, useRef, memo } from "react"
import PropTypes from "prop-types"
import useReRender from "../../../hooks/useReRender"
import uiConfigs from "../../../utils/ui.configs.json"
import styles from "./SecondaryScreen.module.css"

function SecondaryScreen({
  children,
  toggle, // <function> toggler assigned to turn Secondary Screen State off/on
  small, // <boolean> render a smaller screen than default one
  large, // <boolean> render a larger screen than default one
  scrollable, // <boolean> allow scrolling. False will fix the screen
  flex, // <boolean> true will apply display: flex, align-items: center, justify-content: center
  animation, // <string> animation class name that matches the animations CSS classnames here.
  sfxObj, // <object> useAudio() SFX object with two sources
  onClose // <function> callback to trigger when this component unmounts. NO side effects!
}) {
  // boolean state and setter to trigger at component unmounting phase
  const [isUnmounting, setIsUnmounting] = useState(false)
  // classes are stored in a reference, which does not trigger a component
  // re-render when modifying it. We need a way to manually re-render it
  const reRender = useReRender()
  // animation names format: <AnimationClassName + In>. Ex: ScaleIn, FadeIn
  const animationName = animation
    ? animation[0].toUpperCase() + animation.slice(1) + "In"
    : null
  // we need to keep a live reference of these classes for the
  // component's unmounting animation to apply correctly.
  // Order matters! Keep animationName in the last slot
  const classes = useRef([
    styles.ContentContainer,
    small ? styles.Small : "",
    large ? styles.Large : "",
    flex ? styles.Flex : "",
    scrollable ? styles.Scrollable : "",
    animationName ? styles[animationName] : ""
  ])

  const handleBackdropClick = useCallback(() => {
    // if we assigned no animation, or the user updates state from any
    // other component while this one is unmounting (rapid clicking),
    // simply toggle SecondScreen off
    if (!animationName || isUnmounting) return toggle()
    // we have an animation-in state in last slot, remove it
    classes.current.pop(-1)
    // set unmounting state to trigger useEffect
    setIsUnmounting(true)
  }, [isUnmounting, animationName, setIsUnmounting, toggle])

  const handleScreenContainerClick = useCallback((e) => {
    // clicks here must not propagate to backdrop
    e.stopPropagation()
  }, [])

  useEffect(() => {
    let unmountingAnimationTimeout
    // if we are unmounting the component
    if (isUnmounting) {
      // we popped the "in" animation, add the "out" one.
      // Name format is <AnimationName + Out>. E.g.: ScaleOut, FadeOut
      classes.current.push(styles[animationName.slice(0, -2) + "Out"])
      // switch to the next src in the sfx array (close sfx) and play it
      sfxObj.setNextSrc()
      sfxObj.play()
      // set timeout to close SecondaryScreen when animation finishes.
      // Timeout must be equal to animation duration + delay (if any)
      unmountingAnimationTimeout = setTimeout(
        toggle,
        uiConfigs.timeouts.secondScreenUnmountingDelay
      )
      // force an update, since classes will not be updated otherwise,
      // and changes wont reflect on the component, thus no animation
      // will play
      reRender()
      // if there is an onClose callback, execute it.
      // DO NOT provoke side effects here, as the component will unmount
      if (onClose) onClose()
    } else {
      // we are mounting. Set sfx to the first one in the array (open sfx)
      // and play it.
      sfxObj.setNextSrc(0)
      sfxObj.play()
    }
    return () => {
      if (unmountingAnimationTimeout) clearTimeout(unmountingAnimationTimeout)
    }
  }, [isUnmounting])

  return (
    <div
      className={styles.Backdrop}
      onClick={handleBackdropClick}
      aria-label="Click here to close the modal screen"
    >
      <div
        onClick={handleScreenContainerClick}
        role="dialog"
        className={classes.current.join(" ")}
        aria-label="This is the actual modal screen. Click outside of its edges to dismiss it"
      >
        {children}
      </div>
    </div>
  )
}

SecondaryScreen.propTypes = {
  children: PropTypes.node.isRequired,
  toggle: PropTypes.func.isRequired,
  small: PropTypes.bool,
  scrollable: PropTypes.bool,
  animation: PropTypes.string,
  sfxObj: PropTypes.object,
  onClose: PropTypes.func
}

export default memo(SecondaryScreen)
