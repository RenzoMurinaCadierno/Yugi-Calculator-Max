import React, { useContext } from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import uiConfigs from "../../../utils/ui.configs.json"
import { divideLogString } from "./LogItem.utils"
import styles from "./LogItem.module.css"

export default function LogItem({ type, text, timer, irlTime }) {
  const { mq } = useContext(MediaQuery)
  // while holding the device vertically, we want to separate the log text for
  // lifepoints, coin tosses and timer so that they can be nicely displayed in UI
  const mediaQueriedText = mq.portrait
    ? divideLogString(
        text,
        type === uiConfigs.logTypes.timer
          ? ["at"]
          : type === uiConfigs.logTypes.lp
          ? ["]", "-", "+"]
          : [null]
      ).map((t, i) => <span key={i}> {t} </span>)
    : text
  // same for real-time logging. Date on the first line, time on the next one
  const mediaQueriedIrlTime = mq.portrait ? (
    <div>
      {irlTime.split("-").map((t, i) => (
        <span key={i}> {t} </span>
      ))}
    </div>
  ) : (
    <div> {irlTime} </div>
  )

  return (
    <li className={styles.Container}>
      <div> {type} </div>
      <div> {mediaQueriedText} </div>
      <div> {timer} </div>
      {mediaQueriedIrlTime}
    </li>
  )
}

LogItem.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timer: PropTypes.string,
  irlTime: PropTypes.string.isRequired
}
