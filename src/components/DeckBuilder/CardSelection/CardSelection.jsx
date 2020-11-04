import React, { memo, useCallback } from "react"
import PropTypes from "prop-types"
import CardSelectionItem from "../CardSelectionItem/CardSelectionItem"
import { classes, jsx } from "./CardSelection.utils"
import styles from "./CardSelection.module.css"

function CardSelection({
  value, // <string> filter input's value
  cards, // <Array> "cards" array from <CardListScreen />
  cache, // <Array> cache containing all database-pulled card objects
  isLoading, // <boolean> cardListState fetch loading state
  hasError, // <boolean> cardListState fetch error state
  handleCardClick, // <function> < CardSelectionItem/>'s "+1" MiniCircle onClick callback
  fetchCardList, // <function> useFetch()'s refetch function for cardListState
  setCardCache, // <function> cardCache's setter in DeckBuilderContext
  triggerCardDetailsToast // <function> Toast action dispatcher for cross-components calls
}) {
  const refetchCardList = useCallback(() => {
    // re-fetch cards from YGOPRODeck's database. On success, set cardCache with the
    // resulting array of card objects, which will in term re-render this component and
    // keep them loaded for filtering to work. No need to handle .catch(), as if fetch
    // fails, cardListState will auto set error key to true, re-triggering the error
    // message here
    fetchCardList().then((newCardList) => setCardCache(newCardList))
  }, [fetchCardList, setCardCache])

  return (
    <>
      {
        // on loading, show loading JSX with a spinner
        isLoading && jsx.loadingJSX
      }
      {
        // on fetch error, display error message and a button to retry
        hasError && jsx.errorJSX(fetchCardList)
      }
      {
        // from here on, fetch was successful
        !isLoading && !hasError ? (
          // if an app error caused cache array to be empty (and thus, no card
          // objects loaded to filter), show an error message and the option to
          // re-fetch cards from database
          !cache.length ? (
            jsx.errorJSX(refetchCardList)
          ) : // from here on, both cardList and cache are loaded
          cards.length ? (
            // cards array is always cleared if filter contains less than 3 characters,
            // which means that if it is not empty, filtering was successful.
            // In that case, show all <CardSelectionItem />s matching the filtered criteria.
            <ul className={styles.Container}>
              {cards.map((card) => (
                <CardSelectionItem
                  key={card.name}
                  card={card}
                  onAddCircleClick={handleCardClick}
                  onInfoCircleClick={triggerCardDetailsToast}
                />
              ))}
            </ul>
          ) : // if we filtered more than 2 characters and card array's length is 0,
          // that means no results were found for that filter. Show a message telling so.
          value.length > 2 ? (
            jsx.noMatchJSX
          ) : (
            // only fallback case means card array is loaded and there are less than 3
            // characters in filter. Display a message notifying the user cards are loaded.
            jsx.cardsLoadedJSX
          )
        ) : // we need null as !(!isLoading && !hasError) falls back here, which
        // collides with isLoading's/hasError's JSX (they load at the same time).
        // So null will render nothing, leaving only those JSXs left
        null
      }
    </>
  )
}

CardSelection.propTypes = {
  value: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.object),
  cache: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  fetchCardList: PropTypes.func.isRequired,
  triggerCardDetailsToast: PropTypes.func.isRequired
}

export default memo(CardSelection)
