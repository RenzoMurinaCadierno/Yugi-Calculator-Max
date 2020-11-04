import { storeAPICall, timeout } from "../utils/apiFunctions"
import uiConfigs from "../utils/ui.configs.json"

export default function useApiCallWithReducer() {
  /**
   * Triggers the associated reducer loading action and fetches from urlWithNameOrFuzzyQuery
   * what was was inputted as nameOrFuzzyNameQueryParam using storeApiCall function,
   * which is responsible to determine what to do with the upcoming data.
   * On a successful storeApiCall resolution, reducer success dispatch action is executed,
   * otherwise error function is triggered.
   * @param {string} urlWithNameOrFuzzyQuery YgoProDeck's endpoint
   * @param {string} nameOrFuzzyNameQueryParam Query string for fuzzy/name search '?fuzzy="blue-eyes"'
   * @param {function} functionToStoreResObj Reducer function to store an array of responses (currentList)
   * @param {function} loadingAction Reducer's loading dispatch function
   * @param {function} successAction Reducer's success dispatch function
   * @param {function} errorAction Reducer's error dispatch function
   * @param {function} fallbackFunctionToStoreResObj Reducer dispatch function to store a single card (currentCard)
   */
  async function apiFetchAndStoreRes(
    urlWithNameOrFuzzyQuery,
    nameOrFuzzyNameQueryParam,
    functionToStoreListOfCards,
    reducerLoadingDispatch,
    reducerSuccessDispatch,
    reducerErrorDispatch,
    functionToStoreSingleCard
  ) {
    // first thing first, set state to loading
    reducerLoadingDispatch()
    // call for YgoProDeck API with a fallback timeout. This assures to break
    // the user out of the loading state if the DB hangs or internet
    // connection fails.
    let res
    try {
      res = await timeout(
        fetch(`${urlWithNameOrFuzzyQuery}${nameOrFuzzyNameQueryParam}`),
        uiConfigs.apiConfigs.callTimeout,
        "Connection timeout"
      )
      res = await res.json()
      // On a successful response, store it in its respective object.
      storeAPICall(
        res.data,
        functionToStoreListOfCards,
        functionToStoreSingleCard
      )
      // and reset loading state
      reducerSuccessDispatch(res.data)
      // return a new resolved promise with the data response
      return Promise.resolve(res.data)
    } catch (error) {
      // Summon a modal screen to tell the user what happened
      // Set loading to false and return a rejected promise with the
      // error object
      reducerErrorDispatch(error)
      return Promise.reject(error)
    }
  }

  return { apiFetchAndStoreRes }
}
