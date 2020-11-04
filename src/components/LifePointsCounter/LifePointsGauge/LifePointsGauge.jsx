import React, { memo, useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import AnimatedNumber from "animated-number-react"
import PlayerNameTag from "../PlayerNameTag/PlayerNameTag"
import { classes, inlineStyles } from "./LifePointsGauge.utils"
import styles from "./LifePointsGauge.module.css"

function LifePointsGauge({
  dataId, // <string> "p1" or "p2"
  isActive, // <boolean> to set this component as active (to modify LP)
  animatedNumber = {}, // <object> AnimatedNumber config object
  maxLP, // <number> uiConfigs max lifepoints limit
  ariaLabel, // <string> outermost <div> aria-label
  role, // <string> outermost <div> role. Normally "button"
  nameChangeSFX, // <object> useAudio() controls object with two sources (ok and cancel)
  playerName, // <string> The target player name in PlayerContext
  setPlayerNames, // <function> setter function from playerName
  classNames = {}, // <object> classNames object. Check propTypes below for its shape
  onClick = () => {} // <function> outermost <div> on click callback
}) {
  // state for the effect of increasing/decreasing life points.
  // Will show the amount of increased/decreased LP and different colors
  // depending on the +/- operation. it will render on isChanging = true
  const [affectedLP, setAffectedLP] = useState({
    lp: animatedNumber.value,
    isChanging: false,
    color: "#8857fa"
  })
  // isMounting stops affectedLP to trigger on mount
  const isMounting = useRef(true)

  useEffect(() => {
    let affectedLPtimeout
    // do nothing on mount
    if (isMounting.current) isMounting.current = false
    // when AnimatedNumber changes, it means lifepoints were affected
    else {
      // calculate the variation between previous lifepoints and current one
      const deltaLP = animatedNumber.value - affectedLP.lp
      // set the proper values for the affected operation span to show
      setAffectedLP({
        lp: deltaLP,
        isChanging: true,
        color: deltaLP <= 0 ? "#8857fa" : "#86f1f1"
      })
      // and a timeout to hide it and prepare the currect values for the next
      // affection. Sync its dissapearance with the duration of AnimatedNumber effect
      affectedLPtimeout = setTimeout(() => {
        setAffectedLP({
          lp: animatedNumber.value,
          isChanging: false,
          color: "#8857fa"
        })
      }, animatedNumber.duration)
    }
    // clear timeout on unmouting
    return () => affectedLPtimeout && clearTimeout(affectedLPtimeout)
  }, [animatedNumber.value])

  return (
    <div
      data-id={dataId}
      className={classes.container(isActive, classNames.container)}
      aria-label={`${ariaLabel} ${isActive ? "(active)" : ""}`}
      role={role}
      aria-pressed={isActive}
      onClick={onClick}
    >
      <AnimatedNumber
        value={animatedNumber.value}
        formatValue={animatedNumber.formatValue}
        // on mount do not freeze screen. So, apply no duration
        duration={!isMounting.current ? animatedNumber.duration : 0}
        begin={animatedNumber.begin}
        complete={animatedNumber.complete}
        className={styles.AnimatedNumber}
      />
      {
        // are lifepoints being modified? If so, show the span with the animation
        affectedLP.isChanging && (
          <span
            style={inlineStyles.affectedLP(affectedLP.color)}
            className={styles.AffectedLP}
          >
            {affectedLP.lp}
          </span>
        )
      }
      <PlayerNameTag
        currentPlayer={dataId}
        playerName={playerName}
        setPlayerNames={setPlayerNames}
        nameChangeSFX={nameChangeSFX}
        classNames={classes.playerTag(isActive, classNames)}
      />
      <div
        style={inlineStyles.progress(animatedNumber.value, maxLP)}
        className={classes.progress(isActive, classNames.progress)}
      />
    </div>
  )
}

LifePointsGauge.propTypes = {
  dataId: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  animatedNumber: PropTypes.shape({
    value: PropTypes.number.isRequired,
    formatValue: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    begin: PropTypes.func,
    complete: PropTypes.func
  }).isRequired,
  maxLP: PropTypes.number.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  nameChangeSFX: PropTypes.object.isRequired,
  playerName: PropTypes.string,
  setPlayerNames: PropTypes.func.isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    tag: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.arrayOf(PropTypes.string),
    charLimit: PropTypes.arrayOf(PropTypes.string),
    progress: PropTypes.arrayOf(PropTypes.string)
  }),
  onClick: PropTypes.func
}

export default memo(LifePointsGauge)
