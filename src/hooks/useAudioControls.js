import { useState, useCallback, useEffect } from "react"
import useToggle from "./useToggle"

export default function useAudioControls(audioRef, configs = {}) {
  // toggleOn: a true/false toggler <audio> will listen to to turn on/off
  // playbackRate: the playbackRate to set to the audio. Will change IRT too
  // sources: an array pointing to playable audio files
  const { toggleOn, playbackRate, sources } = configs
  // isOn is the universal listener for most effects to play/pause/stop/restart
  // if toggleOn was passed, it will listen to it. Each time toggleOn switches,
  // so will isOn, effectively blocking most functions here
  // on mount, switchOnOff's useEffect will trigger, thats why ! is there
  const [isOn, switchOnOff] = useToggle(!toggleOn ?? true)
  // the audio array if sources was passed as configs
  const [currentSrc, setCurrentSrc] = useState(
    sources ? sources[0] : audioRef.current ? audioRef.current.src : null
  )

  // regular play with additional failsafe checks
  const play = useCallback(() => {
    isOn && audioRef.current && audioRef.current.play()
  }, [isOn, audioRef])

  // even isOn is set to false, play the audio
  const forcePlay = useCallback(() => {
    audioRef.current && audioRef.current.play()
  }, [audioRef])

  // pause the audio at current time
  const pause = useCallback(() => {
    isOn && audioRef.current.pause()
  }, [isOn, audioRef])

  // pause the audio and set currentTime to 0
  const stop = useCallback(() => {
    if (isOn) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isOn, audioRef])

  // pause the audio, set currentTime to 0 and play automatically
  const restart = useCallback(() => {
    stop()
    play()
  }, [play, stop])

  // set reverse playbackRate and play
  const playReverse = useCallback(() => {
    if (isOn) {
      audioRef.current.playbackRate = -1
      play()
    }
  }, [isOn, audioRef, play])

  // given a string source, set audio src to it
  const setSource = useCallback(
    (src) => {
      audioRef.current.src = src
    },
    [audioRef]
  )

  // uses and array of source strings passed in configs to move from track
  // to track setting the audio source
  // You can also pass an integer as a source index in the array to target it
  const setNextSrc = useCallback(
    (srcIndex) => {
      // if no sources array or if there is only one source in it, do nothing
      if (!sources || sources.length <= 1) return
      // if index passed is 0, set source to 0. Otherwise, on a given index,
      // parse it and set it as nextSrcIdx. Else, if nothing was passed as
      // srcIndex or the parsing failed, just set the track to the current idx + 1
      const nextSrcIdx =
        srcIndex === 0
          ? 0
          : parseInt(srcIndex) ||
            sources.findIndex((src) => src === currentSrc) + 1
      // on a not found index or an index exceeding sources array length,
      // set the track to the first one. Otherwise, to the next one from
      // the current track
      if (nextSrcIdx === -1 || nextSrcIdx >= sources.length) {
        setSource(sources[0])
        setCurrentSrc(sources[0])
      } else {
        setSource(sources[nextSrcIdx])
        setCurrentSrc(sources[nextSrcIdx])
      }
    },
    [sources, currentSrc, setSource] //ADDED LAST 2
  )

  // returns true if currentTime is 0 and audio is paused
  const isStopped = useCallback(() => {
    return audioRef.current.currentTime === 0 && audioRef.current.paused
  }, [audioRef])

  // returns true if the audio is currently playing
  const isPlaying = useCallback(() => {
    return !audioRef.current.paused
  }, [audioRef])

  // each time toggleOn is flipped from true to false (or vice-versa), switch
  // isOn to true or false accordingly
  useEffect(switchOnOff, [toggleOn])

  // whenever playbackRate changes, set it to the audio
  useEffect(() => {
    if (playbackRate) audioRef.current.playbackRate = playbackRate
  }, [playbackRate, audioRef])

  return {
    play,
    forcePlay,
    pause,
    stop,
    restart,
    playReverse,
    setSource,
    setNextSrc,
    isOn,
    switchOnOff,
    isStopped,
    isPlaying
  }
}
