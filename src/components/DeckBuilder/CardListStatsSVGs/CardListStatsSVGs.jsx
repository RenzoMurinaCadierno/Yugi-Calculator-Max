import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { getSVGImageWithNotificationsJSX } from "./CardListStatsSVGs.utils"
import styles from "./CardListStatsSVGs.module.css"

export default function CardListStatsSVGs({
  testDeckStats // <object> object generated by utilityFunction's getTestDeckStats()
}) {
  // each "monster", "spell" and "trap" are keys whole values contain "qty"
  // (how many cards share the same name in the "main" section), and "chance"
  // (<number> : likelihood of drawing it )
  const { monster, spell, trap } = testDeckStats
  // standard "toFixed" 2, needed in AnimatedNumber
  const formatValue = useCallback((value) => value.toFixed(2), [])

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>Cards left and chance to draw</div>
      {getSVGImageWithNotificationsJSX(monster, "monster", formatValue)}
      {getSVGImageWithNotificationsJSX(spell, "spell", formatValue)}
      {getSVGImageWithNotificationsJSX(trap, "trap", formatValue)}
    </div>
  )
}

CardListStatsSVGs.propTypes = {
  testDeckStats: PropTypes.shape({
    monster: PropTypes.shape({
      qty: PropTypes.number,
      chance: PropTypes.number
    }),
    spell: PropTypes.shape({
      qty: PropTypes.number,
      chance: PropTypes.number
    }),
    trap: PropTypes.shape({
      qty: PropTypes.number,
      chance: PropTypes.number
    }),
    total: PropTypes.number
  })
}
