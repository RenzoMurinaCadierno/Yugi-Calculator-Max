import React, { useRef } from "react"
import useAudioControls from "./useAudioControls"

export default function useAudio(src, configs = {}) {
  // create a ref to point to the audio. This will enable its access once mounted
  const audioRef = useRef()
  // create the audio JSX. If type was passed as configs, set it.
  // Otherwise, default to "audio/mp3"
  const audioJSX = (
    <audio src={src} ref={audioRef} type={configs.type || "audio/mp3"} />
  )
  // attach an audioControls hook to it.
  const audioControls = useAudioControls(audioRef, configs)
  // return the <audio> JSX, its controls, and its ref
  return [audioJSX, audioControls, audioRef]
}
