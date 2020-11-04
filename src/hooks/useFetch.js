import { useState, useEffect } from "react"

export default function useFetch(url, triggerOn) {
  const [fetchState, setFetchState] = useState({
    data: null,
    isLoading: false,
    hasError: false
  })

  async function fetchData() {
    // set loading state and reset error
    setFetchState({ ...fetchState, isLoading: true, hasError: false })
    try {
      // fetch data and convert it to JSON
      const rawData = await fetch(url)
      const { data } = await rawData.json()
      // set data in state, as well as loading and error to false
      setFetchState({ data, isLoading: false, hasError: false })
      // if we need to do something immediately afterwards, return a resolved promise
      return Promise.resolve(data)
    } catch (err) {
      // set loading to false and error to true, and chain a rejected promise with the error
      setFetchState({ isLoading: false, hasError: true })
      return Promise.reject(err)
    }
  }

  useEffect(() => {
    // my little brain could not figure out how to avoid code repetition
    // by using the function declared above in this async useEffect
    async function fetchData() {
      setFetchState((prevFetchState) => ({
        ...prevFetchState,
        isLoading: true,
        hasError: false
      }))
      try {
        const rawData = await fetch(url)
        const { data } = await rawData.json()
        setFetchState({ data, isLoading: false, hasError: false })
        return Promise.resolve(data)
      } catch (err) {
        setFetchState({ isLoading: false, hasError: true })
        return Promise.reject(err)
      }
    }
    fetchData() // this triggers a request to database on app's mount
  }, [url, triggerOn])

  return [fetchState, fetchData]
}
