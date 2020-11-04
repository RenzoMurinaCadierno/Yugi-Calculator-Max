import React, { Component } from "react"
import SecondaryScreen from "../SecondaryScreen/SecondaryScreen"
import ErrorMessage from "../../../wrappers/ErrorMessage/ErrorMessage"
import { errorMessages } from "../../../utils/utilityObjects"
import uiConfigs from "../../../utils/ui.configs.json"

/**
 * This is the only hand-written class-based component across the whole app.
 * I could not create a functional component since <ErrorBoundary /> does
 * not support them on this React version
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorInfo: null }
    this.handleToggleSecondScreen = this.handleToggleSecondScreen.bind(this)
  }

  componentDidCatch(error, errorInfo) {
    // on a found error, toggle <SecondaryScreen />, which will show its
    // error message component (as children set in <RouteComponents />)
    const { toggleSecondScreen } = this.props
    toggleSecondScreen(uiConfigs.togglers.secondaryScreens.errorBoundary)
    this.setState({ hasError: true })
  }

  handleToggleSecondScreen() {
    // if this component triggered <SecondaryScreen />, use this function
    // to close it, which also sets error state to false
    const { toggleSecondScreen } = this.props
    toggleSecondScreen()
    this.setState({ hasError: false })
  }

  render() {
    const { modalSFX, errorMessageComponent } = this.props
    const connectedToInternet = !navigator.onLine

    return this.state.hasError ? (
      <SecondaryScreen
        toggle={this.handleToggleSecondScreen}
        animation="translateDown"
        sfxObj={modalSFX}
        small={connectedToInternet}
        scrollable={!connectedToInternet}
      >
        {connectedToInternet ? (
          // if the error triggered due to lack of internet connection, trigger this
          <ErrorMessage>{errorMessages.appNeedsInternet}</ErrorMessage>
        ) : (
          // any other error will trigger the generic message
          errorMessageComponent()
        )}
      </SecondaryScreen>
    ) : (
      this.props.children
    )
  }
}

export default ErrorBoundary
