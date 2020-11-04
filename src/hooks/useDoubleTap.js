import { useState, useEffect, useCallback } from "react"

// a hook that listens to double taps (touch devices) or clicks (non-touch)
// devices. It leverages on "onClick", reckognized by both, and is needed
// since "onDoubleClick" and "ontouchstart" are two different events. We
// single them out in one here
export default function useDoubleTap(configs) {
  const { delayBetweenTaps } = configs
  const [taps, setTaps] = useState(0)
  const [isDoubleTap, setIsDoubleTap] = useState(false)

  const call = useCallback(
    (doubleTapCallback, singleTapCallback) => {
      // each time a tap happens, increase taps by 1
      setTaps((tap) => tap + 1)
      // if a double tap happened, set its state to false and trigger the callback
      if (isDoubleTap) {
        setIsDoubleTap(false)
        doubleTapCallback()
        // otherwise, if we assigned a callback to single tapping, fire it
      } else {
        singleTapCallback && singleTapCallback()
      }
    },
    [isDoubleTap]
  )

  useEffect(() => {
    // whenever we hit 1 or more taps, set them back to 0 and set
    // doubleTap to true, which triggers call() above
    if (taps) {
      setTaps(0)
      setIsDoubleTap(true)
    }
    // upon each single tap, wait for a delay. If no new taps happen in that
    // interval, set taps back to 0 and dobuletaps to false again
    const clearClick = setTimeout(() => {
      setTaps(0)
      setIsDoubleTap(false)
    }, delayBetweenTaps || 300)
    // on a new tap timeout is cleared, which means the new tap is indeed
    // a double tap (it happened before setTimout triggered)
    return () => clearTimeout(clearClick)
  }, [taps])

  // pass the function that controls the taps
  return call
}
