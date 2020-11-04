import React, { useContext, memo } from "react"
import PropTypes from "prop-types"
import { LocalStorageContext } from "../../../contexts/LocalStorageContext"
import useAudio from "../../../hooks/useAudio"
import OptionsTitle from "../../../wrappers/OptionsTitle/OptionsTitle"
import Card from "../../UI/Card/Card"
import LifePoints from "../LifePoints/LifePoints"
import Switches from "../Switches/Switches"
import DiceLimits from "../DiceLimits/DiceLimits"
import DangerZone from "../DangerZone/DangerZone"
import clickOKmp3 from "../../../assets/audios/clickOK.mp3"
import clickCancelmp3 from "../../../assets/audios/clickCancel.mp3"
import { classes } from "./Configs.utils"
import styles from "./Configs.module.css"

function Configs({ playSFXs, togglePlaySFXs, toggleSecondScreen, modalSFX }) {
  // getter and updating function for local storage "configs" key
  const { updateLSandGetLSasJSObj, getLSasJSObject } = useContext(
    LocalStorageContext
  )
  // audio JSX and controls object for "confirm" and "OK" SFX
  const [clickOKAudioJSX, clickOKSFX] = useAudio(clickOKmp3, {
    toggleOn: playSFXs
  })
  // audio JSX and controls object for "cancel" SFX
  const [clickCancelAudioJSX, clickCancelSFX] = useAudio(clickCancelmp3, {
    toggleOn: playSFXs
  })
  // usePlayerConfigInputHandler takes an object with two SFX useAudioControl's
  // objects in it: one for "ok" and the other for "cancel" actions.
  const soundEffects = { ok: clickOKSFX, cancel: clickCancelSFX }

  return (
    <section className={styles.Container}>
      <OptionsTitle> Configs </OptionsTitle>
      <div className={styles.Options}>
        <Card type="secondary" classNames={classes.card}>
          <LifePoints
            getLSasJSObject={getLSasJSObject}
            updateLSandGetLSasJSObj={updateLSandGetLSasJSObj}
            soundEffects={soundEffects}
          />
        </Card>
        <Card type="secondary" classNames={classes.card}>
          <Switches playSFXs={playSFXs} togglePlaySFXs={togglePlaySFXs} />
        </Card>
        <Card type="secondary" classNames={classes.card}>
          <DiceLimits
            getLSasJSObject={getLSasJSObject}
            updateLSandGetLSasJSObj={updateLSandGetLSasJSObj}
            soundEffects={soundEffects}
            playSFXs={playSFXs}
          />
        </Card>
        <Card type="danger" classNames={classes.card}>
          <DangerZone
            playSFXs={playSFXs}
            modalSFX={modalSFX}
            toggleSecondScreen={toggleSecondScreen}
          />
        </Card>
      </div>
      {clickOKAudioJSX}
      {clickCancelAudioJSX}
    </section>
  )
}

Configs.propTypes = {
  playSFXs: PropTypes.bool.isRequired,
  togglePlaySFXs: PropTypes.func.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  modalSFX: PropTypes.object.isRequired
}

export default memo(Configs)
