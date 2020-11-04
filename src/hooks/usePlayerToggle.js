import { useState, useCallback } from "react"

export default function usePlayerToggle() {
  const [currentPlayer, setCurrentPlayer] = useState("p1")

  const toggleCurrentPlayer = useCallback(
    // toggle between "p1" and "p2" string values
    () =>
      setCurrentPlayer((currentPlayer) =>
        currentPlayer === "p1" ? "p2" : "p1"
      ),
    []
  )

  return [currentPlayer, toggleCurrentPlayer]
}
