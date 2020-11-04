import { useRef, useEffect } from "react"

export default function usePreviousState(props) {
  // create a ref for whatever is assigned as props
  const ref = useRef()
  // at any phease of the component this hook was called from, update the
  // assigned props. Updating a reference does not trigger a re-render, so
  // doing it this way is not only safe, but also on the component re-render
  // ref.current will effectively hold the previous value.
  useEffect(() => {
    ref.current = props
  })
  return ref.current
}
