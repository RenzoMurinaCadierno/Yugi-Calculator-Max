import React, { useContext } from "react"
import PropTypes from "prop-types"
import useAudio from "../../../hooks/useAudio"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import SidebarMainSideExtra from "../SidebarMainSideExtra/SidebarMainSideExtra"
import SidebarTest from "../SidebarTest/SidebarTest"
import drawmp3 from "../../../assets/audios/draw.mp3"
import shufflemp3 from "../../../assets/audios/shuffle.mp3"
import { classes } from "./DeckCreatorSideBar.utils"

export default function DeckCreatorSideBar({
  deckState, // <object> deckConstructor's reducer state
  dispatchDeckAction, // <function> deckConstructor's reducer action dispatcher
  playSFXs // <boolean> global ON/OFF switch for sound effects
}) {
  // <SidebarTest /> handles some of its elements' styles according to device orientation
  const { mq } = useContext(MediaQuery)
  // audio JSX and controls object for "Draw 1" and "Draw 5" test SVG components
  const [drawAudioJSX, drawSFX] = useAudio(drawmp3, {
    toggleOn: playSFXs,
    playbackRate: 2
  })
  // audio JSX and controls object for "Shuffle" and "Reset" test SVG components
  const [shuffleAudioJSX, shuffleSFX] = useAudio(shufflemp3, {
    toggleOn: playSFXs,
    playbackRate: 2.5
  })

  return (
    <>
      {
        // if we are sitting in "main", "side" or "extra" sections, render
        // <SidebarMainSideExtra />, otherwise <SidebarTest />
        deckState.selectedDeckSection !== "test" ? (
          <SidebarMainSideExtra
            deckState={deckState}
            isPortraitView={mq.portrait}
            classNames={classes.mainSideExtra}
          />
        ) : (
          <SidebarTest
            deckState={deckState}
            dispatchDeckAction={dispatchDeckAction}
            isPortraitView={mq.portrait}
            shuffleSFX={shuffleSFX}
            drawSFX={drawSFX}
            classNames={classes.test}
          />
        )
      }
      {drawAudioJSX}
      {shuffleAudioJSX}
    </>
  )
}

DeckCreatorSideBar.propTypes = {
  deckState: PropTypes.object.isRequired,
  dispatchDeckAction: PropTypes.func.isRequired,
  playSFXs: PropTypes.bool.isRequired
}
