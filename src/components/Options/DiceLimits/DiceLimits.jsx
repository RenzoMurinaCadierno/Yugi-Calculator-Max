import React, { useRef, useReducer, memo } from "react"
import PropTypes from "prop-types"
import { v4 as uuidv4 } from "uuid"
import useAudio from "../../../hooks/useAudio"
import usePlayerConfigInputHandler from "../../../hooks/usePlayerConfigInputHandler"
import coinDieTokenReducer from "../../../store/CoinDieToken/coinDieTokenReducer"
import UICardContainer from "../../../wrappers/UICardContainer/UICardContainer"
import OptionTitle from "../../../wrappers/OptionTitle/OptionTitle"
import OptionBody from "../../../wrappers/OptionBody/OptionBody"
import InputWithSubmit from "../../UI/InputWithSubmit/InputWithSubmit"
import Die from "../../LifePointsCounter/Die/Die"
import uiConfigs from "../../../utils/ui.configs.json"
import dicemp3 from "../../../assets/audios/dice.mp3"
import { classes } from "./DiceLimits.utils"
import styles from "./DiceLimits.module.css"

function DiceLimits({
  updateLSandGetLSasJSObj, // <function> LocalStorageContext's function to update LS
  getLSasJSObject, // <function> LocalStorageContext's function to retrieve LS
  soundEffects, // <object> sound effect object with audio objects, one for "OK", one for "cancel"
  playSFXs // <boolean> global ON/OFF state for audios
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
    playerConfigs.diceConfig,
    uiConfigs.diceConfig,
    updateLSandGetLSasJSObj,
    soundEffects
  )
  // handleSubmit() in usePlayerConfigInputHandler() needs references to the
  // affected inputs in order to perform before-submission actions on them
  // (in this case, if values need to be exchanged between inputs)
  const minRollInputRef = useRef()
  const maxRollInputRef = useRef()
  // create a reducer for testing dice here. Since their logic is not
  // important enough to be kept through components
  const [diceState, diceDispatch] = useReducer(coinDieTokenReducer, {
    items: [
      { id: uuidv4(), res: [] },
      { id: uuidv4(), res: [] },
      { id: uuidv4(), res: [] }
    ]
  })
  // audio JSX and controls object for dice roll SFX
  const [diceAudioJSX, diceSFX] = useAudio(dicemp3, {
    toggleOn: playSFXs,
    playbackRate: 0.7
  })

  function updateLS(e) {
    // perform usePlayerConfigInputHandler's updateLSWithPlayerConfigs using
    // diceConfig's key in localstorage's PlayerConfigs. Pass the input
    // references since it is probable we might exchange their values.
    updateLSWithPlayerConfigs(
      e,
      uiConfigs.localStorageConfigsObjectKeys.playerConfigs,
      "diceConfig",
      {
        reverseInputs: true,
        inputRefOne: minRollInputRef,
        inputRefTwo: maxRollInputRef
      }
    )
  }

  function handleChangeInput(e) {
    // perform usePlayerConfigInputHandler's handleChangeInput with
    // a max of 2 characters per input as a rule
    handleInputChange(e, 2)
  }

  return (
    <UICardContainer>
      <OptionTitle> Dice roll range </OptionTitle>
      <OptionBody>
        <span className={styles.LimitAndTestTag}> Min </span>
        <InputWithSubmit
          type="tel"
          name="minRoll"
          ariaLabel="Minimum roll input"
          value={configState.minRoll}
          reference={minRollInputRef}
          autoComplete="off"
          preventDefault
          onChange={handleChangeInput}
          onBlur={updateLS}
          onSubmit={(e) => handleSubmit(e, minRollInputRef)}
          classNames={classes.diceInput}
        />
        <span className={styles.LimitAndTestTag}> Max </span>
        <InputWithSubmit
          type="tel"
          name="maxRoll"
          ariaLabel="Maximum roll input"
          value={configState.maxRoll}
          reference={maxRollInputRef}
          autoComplete="off"
          preventDefault
          onChange={handleChangeInput}
          onBlur={updateLS}
          onSubmit={(e) => handleSubmit(e, maxRollInputRef)}
          classNames={classes.diceInput}
        />
        <span className={styles.LimitAndTestTag}> Test </span>
        {diceState.items.map((item) => (
          <Die
            key={item.id}
            item={item}
            playerConfigs={playerConfigs}
            diceDispatch={diceDispatch}
            diceSFX={diceSFX}
            classNames={classes.die}
          />
        ))}
        {diceAudioJSX}
      </OptionBody>
    </UICardContainer>
  )
}

DiceLimits.propTypes = {
  updateLSandGetLSasJSObj: PropTypes.func.isRequired,
  getLSasJSObject: PropTypes.func.isRequired,
  soundEffects: PropTypes.shape({
    ok: PropTypes.object.isRequired,
    cancel: PropTypes.object.isRequired
  }).isRequired,
  playSFXs: PropTypes.bool.isRequired
}

export default memo(DiceLimits)
