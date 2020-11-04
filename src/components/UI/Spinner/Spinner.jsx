import React from "react"
import PropTypes from "prop-types"
import { classes } from "./Spinner.utils"
import styles from "./Spinner.module.css"

/**
 * IMPORTANT!
 * I found the HTML and CSS of this particular Spinner some time ago when looking
 * at examples, and copied its base code before customizing it. If you know where
 * the source code is, please let me know so that I can link back to it. I did not
 * take down notes at the time and now I cannot seem to find it again. Thanks!
 */
export default function Spinner({ classNames }) {
  // join default classNames and the ones coming from props into a string
  // const chaseClasses = [...containerClasses, styles.Chase].join(" ")
  // const chaseDotClasses = [...dotsClasses, styles.ChaseDot].join(" ")
  const chaseClasses = classes.container(classNames.container)
  const chaseDotClasses = classes.dots(classNames.dots)

  return (
    <div className={chaseClasses} aria-label="Loading">
      <div className={chaseDotClasses} />
      <div className={chaseDotClasses} />
      <div className={chaseDotClasses} />
      <div className={chaseDotClasses} />
      <div className={chaseDotClasses} />
      <div className={chaseDotClasses} />
    </div>
  )
}

Spinner.propTypes = {
  containerClasses: PropTypes.arrayOf(PropTypes.string),
  dotsClasses: PropTypes.arrayOf(PropTypes.string)
}
