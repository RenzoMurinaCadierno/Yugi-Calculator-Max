import React, { createContext, useReducer } from "react"
import cardSearchReducer from "../store/CardSearch/cardSearchReducer"
import useApiCallWithReducer from "../hooks/useApiCallWithReducer"

export const CardSearchContext = createContext({
  searchReducer: {},
  dispatchSearchAction: () => {},
  apiFetchAndStoreRes: () => {}
})

export function CardSearchContextProvider({ children }) {
  // initialize the reducer and action dispatcher responsible of setting fetch states
  // when calling the API, creating valid card objects to be displayed in <DescPriceScreen />,
  // setting card list cache (immutable unless re-fetching from API) and current card
  // list array (mutable, used to filter loaded cards)
  const [searchReducer, dispatchSearchAction] = useReducer(cardSearchReducer, {
    currentCard: {
      img: "",
      prices: {},
      data: {}
    },
    currentList: [],
    filterableList: [],
    altImgId: "",
    isInListScreen: true,
    isLoading: false,
    hasError: false,
    errorMsg: ""
  })
  // call for the hook responsible of fetching data from the API and interacting
  // with the reducer above to set fetch states and data in the proper arrays
  const { apiFetchAndStoreRes } = useApiCallWithReducer()
  // unite all values to be provided by this context into an object
  const passedContext = {
    searchReducer,
    dispatchSearchAction,
    apiFetchAndStoreRes
  }

  return (
    <CardSearchContext.Provider value={passedContext}>
      {children}
    </CardSearchContext.Provider>
  )
}
