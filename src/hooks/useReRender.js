import { useState, useCallback } from "react"

export default function useReRender() {
  const [, setState] = useState(0)

  // simply increase state count by 1, thus forcing a re-render
  const reRender = useCallback(() => {
    setState((state) => state + 1)
  }, [])

  return reRender
}
