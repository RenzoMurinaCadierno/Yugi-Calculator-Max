import { useState, useEffect } from "react"

export default () => {
  const [state, setState] = useState(false)
  const ping = () => setState(!state)

  // immediately after state is set to true, set it to false.
  useEffect(() => {
    if (state === true) setState(false)
  }, [state])

  return [state, ping]
}
