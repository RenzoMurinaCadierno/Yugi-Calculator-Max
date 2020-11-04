import React, { memo, useContext, useCallback } from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes, formatCardPricesObjIntoArray } from "./PriceScreen.utils"
import styles from "./PriceScreen.module.css"

function PriceScreen({
  prices: { averages, sets }, // <object> "averages" and "sets" values in card object
  name, // <string> the card object's "name" value
  priceRef // <React.createRef> a reference to the first element inside outermost <div> to scroll into view
}) {
  // clicking on each retailer will trigger a <Toast /> before loading their sites,
  // so we need toast reducer's action dispatcher from UIContext
  const { dispatchToastAction } = useContext(UIContext)
  // format card prices object and retailer name into a valid array to use as view
  const lowestCardPrices = averages
    ? formatCardPricesObjIntoArray(averages[0], name)
    : null

  const handleRetailerClick = useCallback(
    (e) => {
      // set site's name as toast text, site's url as href for <a> and the proper
      // toggler to fire a setToastState reducer action. If there is no internet
      // connection, show a warning in the <Toast /> instead
      dispatchToastAction(
        toastActionCreators.setToastState(
          e.target.dataset.site,
          e.target.dataset.url,
          uiConfigs.togglers.toast[
            navigator.onLine ? "retailerSite" : "noConnection"
          ]
        )
      )
    },
    [dispatchToastAction, navigator.onLine]
  )

  return (
    <div className={styles.Container}>
      {/* target top-most div to scroll into view */}
      <div className={styles.Sets} ref={priceRef}>
        {/* name, avg price and code for each set the card was printed in */}
        <div className={styles.BorderSecondary}>Sets and Prices</div>
        {sets &&
          sets.map((set, i) => (
            <ul key={i} className={styles.BorderPrimary}>
              <li> {set.set_name} </li>
              <li>
                {set.set_rarity} {set.set_rarity_code}
              </li>
              <li> $ {set.set_price} </li>
              <li> {set.set_code} </li>
            </ul>
          ))}
      </div>
      {/* retailer names and lowest registered card prices on each of them */}
      <ul className={classes.bestPrices}>
        <li> Best prices </li>
        {lowestCardPrices && (
          <>
            {lowestCardPrices.map((lcp) => (
              <li key={lcp[0]}>
                <span
                  data-site={lcp[0]}
                  data-url={lcp[2]}
                  role="navigation"
                  onClick={handleRetailerClick}
                >
                  {lcp[0]}
                </span>
                <span> {lcp[1]} </span>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}

PriceScreen.propTypes = {
  priceRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  averages: PropTypes.arrayOf(
    PropTypes.shape({
      amazon_price: PropTypes.string,
      cardmarket_price: PropTypes.string,
      coolstuffinc_price: PropTypes.string,
      ebay_price: PropTypes.string,
      tcgplayer_price: PropTypes.string
    })
  ),
  name: PropTypes.string,
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      set_code: PropTypes.string,
      set_name: PropTypes.string,
      set_price: PropTypes.string,
      set_rarity: PropTypes.string,
      set_rarity_code: PropTypes.string
    })
  )
}

export default memo(PriceScreen)
