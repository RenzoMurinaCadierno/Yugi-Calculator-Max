import { useContext } from "react"
import { DeckBuilderContext } from "../contexts/DeckBuilderContext"
import { getLifePointsAudioTrack } from "../store/LifePoints/lifePointsReducer"
import lpChangemp3 from "../assets/audios/lpChange.mp3"
import lpChangeGameEndmp3 from "../assets/audios/lpChangeGameEnd.mp3"
import lpChangemp4 from "../assets/audios/openToast.mp3"
import lpChangeGameEndmp4 from "../assets/audios/closeToast.mp3"

export default function useLifePointsAudio() {
  const { deckState } = useContext(DeckBuilderContext)
  return deckState[`deck_${deckState.selectedDeckId}`] &&
    deckState[`deck_${deckState.selectedDeckId}`].name !==
      getLifePointsAudioTrack()
    ? {
        lpChangemp3,
        lpChangeGameEndmp3
      }
    : {
        lpChangemp3: lpChangemp4,
        lpChangeGameEndmp3: lpChangeGameEndmp4
      }
}
