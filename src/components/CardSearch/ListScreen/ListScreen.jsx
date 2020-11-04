import React, { useEffect, useRef, useCallback, memo } from "react"
import PropTypes from "prop-types"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import CardSearchScreenDivision from "../../../wrappers/CardSearchScreenDivision/CardSearchScreenDivision"
import { getCardObject } from "../../../utils/apiFunctions"
import { getCardTypeStyle } from "../../../utils/yugiohSpecificFunctions"
import { classes } from "./ListScreen.utils"
import styles from "./ListScreen.module.css"

function ListScreen({
  isLoading, // <boolean> CardSearch's reducer fetch "loading" boolean state
  currentCard, // <object> current loaded card object, coming from CardSearch reducer.
  filterableList, // <Array> the list with all card objects in database, coming from CardSearch reducer.
  dispatchSearchAction // <function> CardSearch reducer's action dispatcher
}) {
  // isMounting will prevent auto-switching to <ListScreen /> or <DescPriceScreen />
  // view if a card object is loaded at mount phase with the useEffect below
  const isMounting = useRef(true)

  const fetchForCard = useCallback(
    (e) => {
      if (isMounting.current) return
      // fire the reducer action to set the
      // current card. useEffect below is listening to that to display
      // DescPriceScreen component.
      dispatchSearchAction(
        cardSearchActionCreators.setCurrentCard(
          getCardObject(filterableList[e.target.dataset.listindex])
        )
      )
    },
    [filterableList, dispatchSearchAction]
  )

  useEffect(() => {
    // do nothing at mount, since we will not display <ListScreen /> nor <DescPriceScreen />
    if (isMounting.current) isMounting.current = false
    // when currentCard changes, it means we loaded a new card. Dispatch
    // the reducer function which in term will load DescPriceScreen
    else dispatchSearchAction(cardSearchActionCreators.displayCardScreen())
  }, [currentCard, dispatchSearchAction])

  return (
    <CardSearchScreenDivision classNames={classes.container}>
      {/* filterableList has card objects loaded in it? If so, render a list with
      all of them for the user to click on. Otherwise, render some instructions */}
      {filterableList.length ? (
        filterableList.map((card, i) => (
          <div
            key={card.id}
            data-id={card.name}
            data-listindex={i}
            disabled={isLoading}
            role="button"
            onClick={isLoading ? null : fetchForCard}
            className={styles.Card}
            style={{ color: `${getCardTypeStyle(card.type)}` }}
          >
            {card.name}
          </div>
        ))
      ) : (
        <div className={styles.ExtraInfo}>
          <div>
            Search for a card name or part of it using the search box below.
          </div>
          <div>
            If you already searched, filter the list by typing on it. Or type a
            new card name or part of its name and hit "Search" for new results.
          </div>
          <div>Check out "Tips" for additional information.</div>
        </div>
      )}
    </CardSearchScreenDivision>
  )
}

ListScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  currentCard: PropTypes.shape({
    img: PropTypes.string,
    prices: PropTypes.object,
    data: PropTypes.object
  }),
  filterableList: PropTypes.arrayOf(PropTypes.object),
  dispatchSearchAction: PropTypes.func.isRequired
}

export default memo(ListScreen)
