import React, { memo } from "react"
import PropTypes from "prop-types"
import OptionsTitle from "../../../wrappers/OptionsTitle/OptionsTitle"
import Card from "../../UI/Card/Card"
import { classes } from "./Credits.utils"
import styles from "./Credits.module.css"

function Credits({ toggleSecondScreen, creditsScreens }) {
  return (
    <section className={styles.Container}>
      <OptionsTitle> Credits </OptionsTitle>
      <div className={styles.Options}>
        {creditsScreens.map((ss, i) => (
          <Card
            key={i}
            type="secondary"
            role="button"
            classNames={classes.card}
            onClick={() => toggleSecondScreen(ss[1].toggler)}
          >
            {ss[1].displayTitle}
          </Card>
        ))}
      </div>
    </section>
  )
}

Credits.propTypes = {
  toggleSecondScreen: PropTypes.func.isRequired,
  creditsScreens: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired
}

export default memo(Credits)
