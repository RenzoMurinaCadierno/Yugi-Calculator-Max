import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import SVGImage from "../../UI/SVGImage/SVGImage"
import die from "../../../assets/uiIcons/die.svg"
import coin from "../../../assets/uiIcons/coin.svg"
import token from "../../../assets/uiIcons/token.svg"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./CalculatorRightSide.utils"

function CalculatorRightSide({
  isExpanded, // <boolean> on true, calculator buttons were hidden. View should change accordingly
  toggleSecondScreen // <function> UIContext's secondary screen toggler
}) {
  const handleToggleSecondScreen = useCallback(
    // each SVGImage holds the toggler string as their data-id
    (e) => toggleSecondScreen(e.target.dataset.id),
    [toggleSecondScreen]
  )

  return (
    <aside className={classes.container(isExpanded)}>
      <SVGImage
        src={coin}
        alt="Open coin screen"
        type="secondary"
        role="button"
        dataId={uiConfigs.togglers.secondaryScreens.coin}
        onClick={handleToggleSecondScreen}
        classNames={classes.coin(isExpanded)}
      />
      <SVGImage
        src={die}
        alt="Open dice screen"
        type="secondary"
        role="button"
        dataId={uiConfigs.togglers.secondaryScreens.die}
        onClick={handleToggleSecondScreen}
        classNames={classes.die(isExpanded)}
      />
      <SVGImage
        src={token}
        alt="Open token screen"
        type="secondary"
        role="button"
        dataId={uiConfigs.togglers.secondaryScreens.token}
        onClick={handleToggleSecondScreen}
        classNames={classes.token(isExpanded)}
      />
    </aside>
  )
}

CalculatorRightSide.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired
}

export default memo(CalculatorRightSide)
