import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  memo
} from "react"
import PropTypes from "prop-types"
import { CardSearchContext } from "../../../contexts/CardSearchContext"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import InputWithLabel from "../../UI/InputWithLabel/InputWithLabel"
import Button from "../../UI/Button/Button"
import Spinner from "../../UI/Spinner/Spinner"
import uiConfigs from "../../../utils/ui.configs.json"
import help from "../../../assets/uiIcons/help.svg"
import search from "../../../assets/uiIcons/search.svg"
import { classes, inlineStyles, getInputTexts } from "./SearchMenu.utils"
import styles from "./SearchMenu.module.css"

function SearchMenu({
  secondScreenState, // <boolean> UIContext's <SecondaryScreen /> state toggled ON/OFF
  toggleSecondScreen, // <function> UIContext's <SecondaryScreen /> state toggler
  screenIsFrozen, // <boolean> App.js' swipe frozen state
  setScreenIsFrozen, // <function> App.js' swipe freezing toggler
  dispatchToastAction // <function> UIContext's <Toast /> reducer action dispatcher
}) {
  // all search functionality is handled in this component, so bring them from context
  const {
    searchReducer,
    apiFetchAndStoreRes,
    dispatchSearchAction
  } = useContext(CardSearchContext)
  // decompose needed states from reducer
  const { isLoading, currentList, isInListScreen } = searchReducer
  // state and setter for <InputWithLabel />'s value
  const [searchTerm, setSearchTerm] = useState("")
  // texts to display on focus and blurred <InputWithLabel />'s label
  const inputTexts = getInputTexts(isInListScreen, currentList)

  const onInputChange = useCallback(
    (e) =>
      // input's value controller callback
      setSearchTerm(e.target.value),
    [setSearchTerm]
  )

  const toggleTipSecondaryScreen = useCallback(() => {
    // "Tips" <Button /> callback. Close <Toast /> is any and trigger
    // "searchTips" <SecondaryScreen />
    dispatchToastAction(toastActionCreators.closeToast())
    toggleSecondScreen(uiConfigs.togglers.secondaryScreens.searchTips)
  }, [toggleSecondScreen])

  useEffect(() => {
    // on each keystroke in <InputWithLabel />'s input, set a timeout before
    // applying filtering callback. This is because the list takes time to
    // render on screen, and too many keystrokes at ones will queue up several
    // callbacks, thus lagging view. So, unless timeout expires between typed
    // keys, newly pressed ones will override previous callback requests via
    // their cleanup here
    let timeToTriggerFilter
    if (isInListScreen && currentList.length) {
      timeToTriggerFilter = setTimeout(() => {
        dispatchSearchAction(cardSearchActionCreators.filterList(searchTerm))
      }, uiConfigs.apiConfigs.filterTimeout)
    }
    return () => timeToTriggerFilter && clearTimeout(timeToTriggerFilter)
  }, [searchTerm, isInListScreen, dispatchSearchAction, currentList.length])

  function searchForCards(e) {
    // form submission triggered callback. This is a SPA, so prevent <form>'s default
    e.preventDefault()
    // do nothing if input field is empty. Nothing to search
    if (!searchTerm) return
    // freeze swiping in the whole app while fetch state is loading results
    setScreenIsFrozen(true)
    // fire <CardSearchContext />'s fetch function
    apiFetchAndStoreRes(
      uiConfigs.apiConfigs.cardSearchURL.fuzzy,
      encodeURIComponent(searchTerm),
      (currentList) =>
        dispatchSearchAction(
          cardSearchActionCreators.setCurrentList(currentList)
        ),
      () => dispatchSearchAction(cardSearchActionCreators.setLoading()),
      () => dispatchSearchAction(cardSearchActionCreators.resetFetchState()),
      (error) => dispatchSearchAction(cardSearchActionCreators.setError(error)),
      (currentCard) =>
        dispatchSearchAction(
          cardSearchActionCreators.setCurrentCard(currentCard)
        )
    )
      .then(() => {
        // on a successful fetch, clear <input> and unfreeze the app
        setSearchTerm("")
        setScreenIsFrozen(false)
      })
      .catch((err) => {
        // on failed fetch, log the error and unfreeze the app
        console.log(err)
        setScreenIsFrozen(false)
      })
  }

  return (
    <form className={styles.Container} onSubmit={searchForCards}>
      {/* "Tips" button */}
      <Button
        typeButton
        type="secondary"
        style={inlineStyles.helpButton}
        disabled={screenIsFrozen}
        nonStyledDisabled={secondScreenState}
        onClick={toggleTipSecondaryScreen}
      >
        <img
          className={styles.HelpIcon}
          src={help}
          alt="Search help and tips"
        />
        Tips
      </Button>
      {/* Input and label used to search for cards */}
      <InputWithLabel
        id="search"
        type="text"
        value={searchTerm}
        labelText={inputTexts[0]}
        helpText={inputTexts[2]}
        disabled={isLoading}
        autoComplete="off"
        role="search"
        onChange={onInputChange}
        labelTextOnFocus={inputTexts[1]}
        helpTextOnFocus={inputTexts[3]}
        classNames={classes.inputWithLabel}
      />
      {/* "Searcg" button */}
      <Button
        typeSubmit
        style={inlineStyles.searchButton}
        disabled={isLoading || searchTerm.length < 2}
        nonStyledDisabled={secondScreenState}
      >
        <img
          className={styles.SearchIcon}
          src={search}
          alt="Search help and tips"
          style={inlineStyles.searchIcon(isLoading, searchTerm)}
        />
        {/* if loading state, show <Spinner />, otherwise "Search" */}
        {isLoading ? <Spinner classNames={classes.spinner} /> : "Search"}
      </Button>
    </form>
  )
}

SearchMenu.propTypes = {
  secondScreenState: PropTypes.bool.isRequired,
  toggleSecondScreen: PropTypes.func.isRequired,
  screenIsFrozen: PropTypes.bool.isRequired,
  setScreenIsFrozen: PropTypes.func.isRequired,
  dispatchToastAction: PropTypes.func.isRequired
}

export default memo(SearchMenu)
