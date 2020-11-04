import { useCallback } from "react"
import uiConfigs from "../utils/ui.configs.json"

export default function useLocalStorage(LSKey, LSValues, configs = {}) {
  /**
   * Creates a valid LocalStorage object for the app. If it fails to do so,
   * an alert message will pop up and the window will close.
   * This means the app needs LocalStorage to run.
   */
  const createLSObject = useCallback(() => {
    let localStorageObject = {}
    // create a valid LocalStorage object using each key name set in uiConfigs,
    // grabbing its initial values which are also specified in uiConfigs
    LSValues.forEach((item) => {
      const key = Object.keys(item)[0]
      localStorageObject[key] = uiConfigs[item[key]]
    })
    // try setting LocalStorage with that object
    try {
      window.localStorage.setItem(LSKey, JSON.stringify(localStorageObject))
      // alert the user of the error and shut the app up
    } catch (err) {
      console.log(err)
      window.alert(
        "This app needs LocalStorage to run. Please, enable it to continue."
      )
      window.close()
    }
    // upon success, return the LocalStorage object
    return localStorageObject
  }, [LSKey, LSValues])

  /**
   * Tries parsing and returning LocalStorage object, and if it fails,
   * it creates a new one to return.
   */
  const getLSasJSObject = useCallback(() => {
    let localStorageObject = {}
    try {
      localStorageObject = JSON.parse(window.localStorage.getItem(LSKey))
      // if LocalStorage object is empty, create one.
      if (Object.keys(localStorageObject).length === 0) {
        localStorageObject = createLSObject()
      }
    } catch (err) {
      // if LocalStorage object is invalid, create one.
      localStorageObject = createLSObject()
    }
    return localStorageObject
  }, [LSKey, createLSObject])

  /**
   * Updates localstorage with the passed object
   * @param {string} updatedLSObject A valid JS object to set LocalStorage with
   */
  const updateBrowserLSItem = useCallback(
    (objectToUpdateLS, callbackBeforeUpdating) => {
      let updatedLSObject = objectToUpdateLS
      if (callbackBeforeUpdating) {
        updatedLSObject = callbackBeforeUpdating(objectToUpdateLS)
      }
      try {
        window.localStorage.setItem(LSKey, JSON.stringify(updatedLSObject))
      } catch (err) {
        console.log(err)
      }
    },
    [LSKey]
  )

  /**
   * Updates a key or nested key inside LocalStorage and returns a reference to it.
   * @param {string} key LocalStorage's key to update.
   * @param {string} nestedKey Localstorage specific nested key to update inside of the parent key.
   * @param {any} value The value the key will be updated with.
   * @param {boolean} overrideValue true will override the whole key with the value, false will only update the nested key.
   * @param {boolean} unshiftFirstItem On true, before the insertion of the new value, the oldest one will be removed if the max LS limit is reached.
   * @param {function} genValueWithLS Use this function to generate a value with current Local Storage object.
   */
  const updateLSandGetLSasJSObj = useCallback(
    ({
      key,
      nestedKey,
      value,
      overrideValue,
      unshiftFirstItem,
      genValueWithLS
    }) => {
      // bring the parsed LocalStorage object up
      const localStorageObject = getLSasJSObject()
      // shift the oldest item on LocalStorage target key if the max limit was reached
      // and we want to shift indeed.
      if (
        unshiftFirstItem &&
        localStorageObject[key].length >= configs.maxLogLength
      ) {
        localStorageObject[key].shift()
      }
      // if we need current Local Storage object to generate a value, use the genValueWithLS()
      // assigned as parameter
      let updatedValue = value
      if (genValueWithLS) updatedValue = genValueWithLS(localStorageObject)
      // make sure both LS key and updated are objects to update them as such. If value is an
      // object but LS key is an array, this check is false, and will update LS Key array by
      // appending the whole value object to it. Check below for the logic
      const valueAndLSKeyAreTypeObject =
        typeof updatedValue === "object" &&
        !Array.isArray(localStorageObject[key])
      // update the specified key or nested key. Override the previous value if overrideValue
      // is true. Otherwise, update only the targetted key and leave the rest alone.
      const updatedLSObject = nestedKey
        ? {
            ...localStorageObject,
            [key]: overrideValue
              ? {
                  ...localStorageObject[key],
                  [nestedKey]: updatedValue
                }
              : {
                  ...localStorageObject[key],
                  [nestedKey]: valueAndLSKeyAreTypeObject
                    ? {
                        ...localStorageObject[key][nestedKey],
                        ...updatedValue
                      }
                    : [...localStorageObject[key][nestedKey], updatedValue]
                }
          }
        : {
            ...localStorageObject,
            [key]: overrideValue
              ? updatedValue
              : valueAndLSKeyAreTypeObject
              ? { ...localStorageObject[key], ...updatedValue }
              : [...localStorageObject[key], updatedValue]
          }
      // refresh LocalStorage and return a pointer to the updated object (key)
      updateBrowserLSItem(updatedLSObject)
      return updatedLSObject
    },
    [getLSasJSObject, configs.maxLogLength, updateBrowserLSItem]
  )

  /**
   * Deletes / clears a key or nested key inside LocalStorage and returns a reference to it.
   * @param {string} key LocalStorage's key to clear.
   * @param {string} nestedKey Localstorage specific nested key to clear inside of the parent key
   * @param {boolean} removeKey True if the key should be destroyed. False to just clear it.
   */
  const deleteAndGetLSObject = useCallback(
    ({ key, nestedKey, removeKey, callbackBeforeUpdating }) => {
      // get the Localstorage object
      const localStorageObject = getLSasJSObject()
      // do we want to completely remove the key?
      if (removeKey) {
        // delete the 2nd-leven nested key if specified, otherwise, the 1st-level key
        nestedKey
          ? delete localStorageObject[key][nestedKey]
          : delete localStorageObject[key]
        // update LocalStorage with this new object (key removed) and return the object
        updateBrowserLSItem(localStorageObject, callbackBeforeUpdating)
        return localStorageObject
      }
      // we do not want to destroy the key, but just clear it. Again, if a 2nd-level nested
      // key was specified, clear it. Leave the rest of the entries inside the key intact.
      // If we specified no nested Key, clear the whole 1st-level key.
      let deletedLSObject = nestedKey
        ? {
            ...localStorageObject,
            [key]: {
              ...localStorageObject[key],
              [nestedKey]: []
            }
          }
        : {
            ...localStorageObject,
            [key]: []
          }
      // refresh LocalStorage and return a pointer to the deleted object (key)
      updateBrowserLSItem(deletedLSObject)
      return deletedLSObject
    },
    [getLSasJSObject, updateBrowserLSItem]
  )

  return { getLSasJSObject, updateLSandGetLSasJSObj, deleteAndGetLSObject }
}
