import React, { useState, createContext, useReducer } from "react"
import toastReducer from "../store/Toast/toastReducer"
import pageSwipeReducer from "../store/PageSwipe/pageSwipeReducer"
import useToggleSecondScreen from "../hooks/useToggleSecondScreen"
import useToggle from "../hooks/useToggle"
import uiConfigs from "../utils/ui.configs.json"

export const UIContext = createContext({
  secondScreenType: "",
  secondScreenState: false,
  toggleSecondScreen: () => {},
  pageState: {},
  dispatchPageAction: () => {},
  screenIsFrozen: false,
  setScreenIsFrozen: () => {},
  playSFXs: true,
  togglePlaySFXs: () => {},
  toastState: {},
  dispatchToastAction: () => {},
  appIsLoadingSomething: false,
  setAppIsLoadingSomething: () => {}
})

export function UIContextProvider({ children }) {
  // global Secondary Screen handlers. Will be used across the whole app
  const {
    secondScreenType,
    secondScreenState,
    toggleSecondScreen
  } = useToggleSecondScreen()
  // global <Toast /> handlers. Will be used across the whole app
  const [toastState, dispatchToastAction] = useReducer(toastReducer, {
    text: "",
    url: "",
    type: "",
    logTypeArray: [],
    isActive: false,
    refreshTimeoutToggler: false
  })
  // page reducer state and action dispatch to be handled by App.js
  // It controls which components to load with BrowserRouter modifying the
  // array in its state, as well as "slide" animation classNames
  const [pageState, dispatchPageAction] = useReducer(pageSwipeReducer, {
    pageArray: uiConfigs.pageNames,
    slide: "left-slide"
  })
  // boolean state and setter to freeze swiping in app. Used across the whole app
  const [screenIsFrozen, setScreenIsFrozen] = useState(false)
  // global boolean and toggler to turn all SFXs ON/OFF. All useAudio() instances
  // across the app listen to this to enable/disabled <audio>s
  const [playSFXs, togglePlaySFXs] = useToggle(true)
  // global boolean and setter to show a loading icon whenever the app is in
  // "loading" state while not being handled specifically by a component
  const [appIsLoadingSomething, setAppIsLoadingSomething] = useState(false)
  // unite all values to be provided by this context into an object
  const contextValues = {
    secondScreenType,
    secondScreenState,
    toggleSecondScreen,
    pageState,
    dispatchPageAction,
    screenIsFrozen,
    setScreenIsFrozen,
    playSFXs,
    togglePlaySFXs,
    toastState,
    dispatchToastAction,
    appIsLoadingSomething,
    setAppIsLoadingSomething
  }
  return (
    <UIContext.Provider value={contextValues}>{children}</UIContext.Provider>
  )
}
