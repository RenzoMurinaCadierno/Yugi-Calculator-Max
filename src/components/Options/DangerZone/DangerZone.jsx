import React, { memo } from "react"
import PropTypes from "prop-types"
import DangerZoneSecondaryScreens from "../DangerZoneSecondaryScreens/DangerZoneSecondaryScreens"
import Button from "../../UI/Button/Button"
import UICardContainer from "../../../wrappers/UICardContainer/UICardContainer"
import OptionTitle from "../../../wrappers/OptionTitle/OptionTitle"
import OptionBody from "../../../wrappers/OptionBody/OptionBody"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./DangerZone.utils"

function DangerZone({ modalSFX, toggleSecondScreen }) {
  return (
    <>
      <DangerZoneSecondaryScreens modalSFX={modalSFX} />
      <UICardContainer>
        <OptionTitle> Danger Zone </OptionTitle>
        <OptionBody classNames={classes.optionBody}>
          <Button
            type={navigator.onLine ? "secondary" : "disabled"}
            disabled={!navigator.onLine} // disable refetch option if no internet connection
            sutileAnimation
            onClick={() =>
              toggleSecondScreen(
                uiConfigs.togglers.secondaryScreens.reloadCardList
              )
            }
            classNames={classes.optionRefresh}
          >
            {navigator.onLine
              ? "Refresh deck builder's card list"
              : "Connect to internet to reload cards"}
          </Button>
          <Button
            type="secondary"
            sutileAnimation
            onClick={() =>
              toggleSecondScreen(uiConfigs.togglers.secondaryScreens.resetApp)
            }
            classNames={classes.optionReset}
          >
            Reset app
          </Button>
        </OptionBody>
      </UICardContainer>
    </>
  )
}

DangerZone.propTypes = {
  modalSFX: PropTypes.object.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired
}

export default memo(DangerZone)
