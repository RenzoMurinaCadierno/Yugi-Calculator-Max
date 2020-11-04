import React, { useRef, memo } from "react"
import PropTypes from "prop-types"
import usePlayerConfigInputHandler from "../../../hooks/usePlayerConfigInputHandler"
import UICardContainer from "../../../wrappers/UICardContainer/UICardContainer"
import OptionTitle from "../../../wrappers/OptionTitle/OptionTitle"
import OptionBody from "../../../wrappers/OptionBody/OptionBody"
import InputWithSubmit from "../../UI/InputWithSubmit/InputWithSubmit"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./LifePoints.utils"
import styles from "./LifePoints.module.css"

function LifePoints({
  updateLSandGetLSasJSObj, // <fucntion> LocalStorageContext's function to update LS
  getLSasJSObject, // <function> LocalStorageContext's function to retrieve LS
  soundEffects // <object> sound effect object with audio objects, one for "OK", one for "cancel"
}) {
  // grab player configurations from "Configs" local storage key
  const { playerConfigs } = getLSasJSObject()
  // initialize the hook that controls player names' or dice limits' <InputWithSubmit />
  const {
    configState,
    handleInputChange,
    handleSubmit,
    updateLSWithPlayerConfigs
  } = usePlayerConfigInputHandler(
    playerConfigs.initialLifePoints,
    uiConfigs.initialLP,
    updateLSandGetLSasJSObj,
    soundEffects
  )
  // input references to force blurring when users hit "ENTER" or "RETURN"
  const p1InputRef = useRef()
  const p2InputRef = useRef()
  // we cannot useCallback here, we need the function to be reconstructed
  // for the custom hook to recieve new values each time
  function updateLS(e) {
    updateLSWithPlayerConfigs(
      e,
      uiConfigs.localStorageConfigsObjectKeys.playerConfigs,
      "initialLifePoints"
    )
  }
  // same here. Max limit is normally 5 digits for simplicity sake
  function handleChangeInput(e) {
    handleInputChange(e, uiConfigs.optionsConfigs.lifePointsCharLimit)
  }

  return (
    <UICardContainer>
      <OptionTitle> Initial Life Points </OptionTitle>
      <OptionBody>
        <span className={styles.PlayerTag}> Player 1 </span>
        <InputWithSubmit
          type="tel"
          name="p1"
          ariaLabel={"Player one starting lifepoints input"}
          value={configState.p1}
          reference={p1InputRef}
          autoComplete="off"
          preventDefault
          onChange={handleChangeInput}
          onBlur={updateLS}
          onSubmit={(e) => handleSubmit(e, p1InputRef)}
          classNames={classes.lifePointsInput}
        />
        <span className={styles.PlayerTag}> Player 2 </span>
        <InputWithSubmit
          type="tel"
          name="p2"
          ariaLabel={"Player two starting lifepoints input"}
          value={configState.p2}
          reference={p2InputRef}
          autoComplete="off"
          preventDefault
          onChange={handleChangeInput}
          onBlur={updateLS}
          onSubmit={(e) => handleSubmit(e, p2InputRef)}
          classNames={classes.lifePointsInput}
        />
      </OptionBody>
    </UICardContainer>
  )
}

LifePoints.propTypes = {
  updateLSandGetLSasJSObj: PropTypes.func.isRequired,
  getLSasJSObject: PropTypes.func.isRequired,
  soundEffects: PropTypes.shape({
    ok: PropTypes.object.isRequired,
    cancel: PropTypes.object.isRequired
  }).isRequired
}

export default memo(LifePoints)
