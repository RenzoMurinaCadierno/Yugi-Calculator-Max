import React, { useEffect, useRef, memo, useCallback } from "react"
import PropTypes from "prop-types"
import { classes } from "./Slider.utils"

function Slider({
  switchState, // <boolean> not needed if using setState in this component
  setSwitch, // <function> not needed if using setState in this component
  onSwitchOn = () => {}, // <function> callback to trigger when we toggle switch on
  onSwitchOff = () => {}, // <function> callback to trigger when we toggle switch off
  textON, // <string> text to display on switch on
  textOFF, // <string> text to display on switch off
  ariaLabelOn = "Switch ON", // <string> aria-label for outermost <div> when switch is on
  ariaLabelOff = "Switch OFF", // <string> aria-label for outermost <div> when switch is off
  classNames = {} // <object> classNames object. Check propTypes below for its constitution
}) {
  // uncomment this if you need to use this standalone component
  // (passing no switchState/setSwitch props)
  // const [switchState, setSwitch] = useState(false)

  // isMounting will prevent SFX to play on mount and switch to auto-toggle
  const isMounting = useRef(true)

  // switch toggler callback
  const toggleSwitch = useCallback(
    () => setSwitch((switchState) => !switchState),
    [setSwitch]
  )

  useEffect(() => {
    // do nothing on mount. It will auto-toggle otherwise
    if (isMounting.current) isMounting.current = false
    // trigger onSwitchOn callback if switchState changes to true
    else if (switchState) onSwitchOn()
    // onSwitchOff callback otherwise
    else onSwitchOff()
  }, [switchState, onSwitchOn, onSwitchOff])

  return (
    <div
      className={classes.container(classNames.container)}
      aria-label={switchState ? ariaLabelOn : ariaLabelOff}
      role="switch"
      aria-checked={switchState}
    >
      <div
        className={classes.sliderBar(classNames.sliderBar)}
        onClick={toggleSwitch}
      >
        <div
          // selector classes by default. selectorOn classes if active
          className={classes.selector(
            switchState,
            classNames.selector,
            classNames.selectorOn
          )}
        />
        <div
          // textOff classes by default. textOn classes if active
          className={classes.text(
            switchState,
            classNames.textOff,
            classNames.textOn
          )}
        >
          {switchState ? textON : textOFF}
        </div>
      </div>
    </div>
  )
}

Slider.propTypes = {
  switchState: PropTypes.bool,
  setSwitch: PropTypes.func,
  onSwitchOn: PropTypes.func.isRequired,
  onSwitchOff: PropTypes.func.isRequired,
  textON: PropTypes.string.isRequired,
  textOFF: PropTypes.string.isRequired,
  ariaLabelOn: PropTypes.string,
  ariaLabelOff: PropTypes.string,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    slideBar: PropTypes.arrayOf(PropTypes.string),
    selector: PropTypes.arrayOf(PropTypes.string),
    selectorOn: PropTypes.arrayOf(PropTypes.string),
    textOn: PropTypes.arrayOf(PropTypes.string),
    textOff: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(Slider)
