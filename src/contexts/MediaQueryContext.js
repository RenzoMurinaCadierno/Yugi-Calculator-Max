import React, { createContext, useEffect, useState } from "react"
import uiConfigs from "../utils/ui.configs.json"

export const MediaQuery = createContext({
  mq: {}
})

// media queries are set on the word "go". They do not change, so we might as
// well load save them in an object outside the provider when the app is compiled
const mediaQueriesObjectState = {}

for (let key in uiConfigs.mediaQueries) {
  mediaQueriesObjectState[key] = false
}

export function MediaQueryProvider({ children }) {
  // state and setter to handle the current media query state
  const [mq, setMq] = useState(mediaQueriesObjectState)

  useEffect(() => {
    // on app's mount, update the current media query state and  add the event
    // listener for "resize". Many components change their behavior according
    // to device orientation and size
    watchMediaQueryChange()
    window.addEventListener("resize", watchMediaQueryChange)
    return () => window.removeEventListener("resize", watchMediaQueryChange)
  }, [])

  function watchMediaQueryChange() {
    // This function is triggered each time the device changes its media query.
    // For each media query key in "mq" object, check if they match the current
    // device orientation/size, and update their booleans accordingly.
    const mqCopy = { ...mq }
    for (let query in mqCopy) {
      mqCopy[query] = window.matchMedia(uiConfigs.mediaQueries[query]).matches
    }
    setMq(mqCopy)
  }

  // unite all values to be provided by this context into an object
  const passedContext = { mq }

  return (
    <MediaQuery.Provider value={passedContext}>{children}</MediaQuery.Provider>
  )
}
