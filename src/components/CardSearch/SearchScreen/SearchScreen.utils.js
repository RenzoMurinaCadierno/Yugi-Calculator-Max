import React from "react"
import uiConfigs from "../../../utils/ui.configs.json"
import styles from "./SearchScreen.module.css"

export const classes = {
  cardImgScreen: [styles.CardImageScreen],
  arrowLeft: {
    container: [styles.ArrowContainer, styles.ArrowContainerLeft],
    arrow: [styles.ArrowArrow],
    text: [styles.ExtraText, styles.ExtraTextList]
  },
  arrowRight: {
    container: [styles.ArrowContainer, styles.ArrowContainerRight],
    arrow: [styles.ArrowArrow],
    text: [styles.ExtraText]
  },
  [uiConfigs.togglers.toast.cardImgScreen]: [styles.ToastLink],
  [uiConfigs.togglers.toast.retailerSite]: [styles.ToastLinkInline],
  [uiConfigs.togglers.toast.cardInfoWarning]: [styles.ToastLink]
}

/**
 * JSX to display on Toast components with plain children. They take their
 * togglers as the object key and return a function which takes the toast
 * state, the style for the toast link to click and its onClick callback
 * (the latter two only if a link exists in children)
 */
export const toastJSXs = {
  [uiConfigs.togglers.toast.cardImgScreen]: (state, linkStyle, onClick) => (
    <>
      <span className={linkStyle} onClick={onClick}>
        Click here for original art
      </span>
      Scroll down Card Description for alternate arts
    </>
  ),
  [uiConfigs.togglers.toast.noConnection]: () => (
    <>Cannot load resource. No internet connection.</>
  ),
  [uiConfigs.togglers.toast.retailerSite]: (state, linkStyle, onClick) => (
    <>
      Tap
      <span className={linkStyle} onClick={onClick}>
        {state.text}
      </span>
      to search for the card name there
    </>
  ),
  [uiConfigs.togglers.toast.cardInfoWarning]: (state, linkStyle) => (
    <>
      <span className={linkStyle}>{state.url}</span>
      {state.text}
    </>
  )
}
