import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import LogItem from "../LogItem/LogItem"
import styles from "./LogScreen.module.css"

export default function LogScreen({
  logs, // <Array> log array inside logState reducer
  filterLogs // <function> log reducer's action to filter logs (in LogContext)
}) {
  // callback to reverse logs
  const reverseLogs = useCallback(() => filterLogs("reverse"), [filterLogs])

  return (
    <section className={styles.Container} aria-label="Log page">
      <div className={styles.LogBackground}> Log </div>
      <ul aria-label="log properties" className={styles.Header}>
        <li> Type </li>
        <li> Message </li>
        <li> Timer </li>
        <li onClick={reverseLogs} aria-label="Order by date">
          IRL time
        </li>
      </ul>
      <ul aria-label="log list" className={styles.Content}>
        <TransitionGroup component={null}>
          {logs?.map((log) => (
            <CSSTransition
              key={log.id}
              timeout={500}
              classNames="animate-log-item"
            >
              <LogItem {...log} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    </section>
  )
}

LogScreen.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timer: PropTypes.string,
      irlTime: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  filterLogs: PropTypes.func.isRequired
}
