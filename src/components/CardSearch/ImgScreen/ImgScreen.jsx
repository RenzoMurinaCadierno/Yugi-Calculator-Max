import React, { useContext, useCallback } from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import CardSearchScreenDivision from "../../../wrappers/CardSearchScreenDivision/CardSearchScreenDivision"
import cardNotFound from "../../../assets/images/cardNotFound.jpg"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./ImgScreen.utils"

export default function ImgScreen({
  src // <string> path to img src
}) {
  // a confirmation <Toast /> triggers before opening an image. We need <Toast />
  // reducer state and dispatcher coming from UIContext
  const { toastState, dispatchToastAction } = useContext(UIContext)

  const handleToggleToast = useCallback(() => {
    // toggles <Toast /> to active and sets the proper type to render
    // <AltArtImgDisplay />'s <SecondaryScreen />, or a warning to
    // tell the user they cannot load resources because of no connection
    dispatchToastAction(
      toastActionCreators.setToastState(
        null,
        null,
        uiConfigs.togglers.toast[
          navigator.onLine ? "cardImgScreen" : "noConnection"
        ]
      )
    )
  }, [dispatchToastAction, navigator.onLine])

  return (
    <CardSearchScreenDivision classNames={classes.container}>
      {/* render "not found" data if not online */}
      <img
        src={navigator.onLine ? src : cardNotFound}
        alt={navigator.onLine ? "Card image" : "Card image not found"}
        onClick={navigator.onLine ? handleToggleToast : null}
        className={classes.image(toastState.isActive)}
      />
    </CardSearchScreenDivision>
  )
}

ImgScreen.propTypes = {
  src: PropTypes.string
}
