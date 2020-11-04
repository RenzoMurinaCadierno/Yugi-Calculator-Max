import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  memo
} from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import CardSearchScreenDivision from "../../../wrappers/CardSearchScreenDivision/CardSearchScreenDivision"
import DescScreen from "../DescScreen/DescScreen"
import PriceScreen from "../PriceScreen/PriceScreen"
import RotatableArrowIcon from "../../UI/RotatableArrowIcon/RotatableArrowIcon"
import { classes, ariaLabels } from "./DescPriceScreen.utils"
import styles from "./DescPriceScreen.module.css"

function DescPriceScreen({
  currentCard: { prices, data }, // <object> "prices" and "data" values in currentCard object, in searchReducer
  currentList, // <Array> filtered list of card objects, also in searchReducer
  dispatchSearchAction // <function> searchReducer's action dispatcher
}) {
  const { mq } = useContext(MediaQuery)
  // state and setter to track which screen is being shown at the time.
  // "right" for card details, "left" for card prices, and "both" for both
  // split in half
  const [showing, setShowing] = useState(mq.xs ? "right" : "both")
  // classNames for both <CardSearchScreenDivision />s. We keep them in refs
  // as we need to resize screen first (re-render) and then add classes.
  const descClass = useRef(mq.xs ? styles.Show : "")
  const priceClass = useRef(mq.xs ? styles.Hide : "")
  // ref to scroll components into view once re-rendered
  const cardDescRef = useRef()
  const priceRef = useRef()
  // isMounting will prevent switching to <ListScreen /> or scrolling components
  // into view automatically at mount phase
  const isMounting = useRef(true)

  const resizeScreen = useCallback(
    ({ target }) => {
      // target.id can be right/left/up/down, all screen-toggler arrow positions
      // showing can be desc/price/both, indicating which screen is being displayed
      if (showing === "both") {
        // we are currently showing both info and prices screens, and will toggle
        // it to show info (desc) only
        if (target.id === "right" || target.id === "up") {
          // show card info screen and hide prices screen
          descClass.current = styles.Show
          priceClass.current = styles.Hide
          // set state to sit on card info (desc) screen
          setShowing("desc")
          // we are toggling to show price description screen only
        } else if (target.id === "left" || target.id === "down") {
          // show card prices screen and hide info screen
          descClass.current = styles.Hide
          priceClass.current = styles.Show
          // set state to sit on card prices screen
          setShowing("price")
        }
      } else if (mq.xs) {
        // on xs devices, do not divide the screen. Show one at a time
        if (target.id === "right" || target.id === "up") {
          // show card prices screen and hide info screen
          descClass.current = styles.Hide
          priceClass.current = styles.Show
          // set state to sit on card prices screen
          setShowing("price")
        } else {
          // show card info screen and hide prices screen
          descClass.current = styles.Show
          priceClass.current = styles.Hide
          // set state to sit on card info (desc) screen
          setShowing("desc")
        }
        // we are not on an xs device, and we are coming from a full screen price
        // or card info screen to show both at the same time.
      } else {
        // reset both classes. Defaults to show both.
        descClass.current = ""
        priceClass.current = ""
        // set state to sit on both screens.
        setShowing("both")
      }
    },
    [showing, mq.xs]
  )

  useEffect(() => {
    // do nothing on mount
    if (isMounting.current) isMounting.current = false
    // if currentList changes, it means we searched for a card and multiple results
    // came back from the API, so, toggle back to ListScreen component
    else dispatchSearchAction(cardSearchActionCreators.displayListScreen())
  }, [currentList, dispatchSearchAction])

  useEffect(() => {
    // a change on mq.xs here means the user resized their device (from landscape to
    // portrait or vice-versa). So, trigger screen resize function.
    if (mq.xs && showing === "both") {
      resizeScreen({ target: { id: "right" } })
    } else if (!mq.xs) {
      resizeScreen({ target: { id: "both" } })
    }
  }, [mq.xs])

  useEffect(() => {
    // on mount, do nothing
    if (isMounting.current) return
    // mq.xs changing is the user manually switching from landscape to portrait
    // and vice-versa, while data changing means we are sitting in this component
    // and the user searched for a specific card, thus, not triggering a way
    // back to ListScreen component.
    let timeout = undefined
    if (!mq.xs) {
      // the device is larger than xs, scroll both screens back into view
      cardDescRef.current.scrollIntoView()
      timeout = setTimeout(() => priceRef.current.scrollIntoView(), 0)
    } else if (showing === "desc" || showing === "both") {
      // device is xs and we are currently sitting in info component or both
      // screens. Info screen is brought up front by default, so scroll it up.
      return cardDescRef.current.scrollIntoView({ behavior: "smooth" })
    } else if (showing === "price") {
      // device is xs and we are currently showing price. Scroll it up.
      return priceRef.current.scrollIntoView({ behavior: "smooth" })
    }
    return () => {
      // clear timer on unmount. Timer is needed to event-queue up scroll actions,
      // since the animations overlay each other when done instantly.
      if (timeout) clearTimeout(timeout)
    }
  }, [mq.xs, data])

  return (
    <div className={styles.Container}>
      <CardSearchScreenDivision
        classNames={classes.screenDivision(mq.xs, descClass.current)}
      >
        <DescScreen
          data={data}
          showing={showing}
          cardDescRef={cardDescRef}
          dispatchSearchAction={dispatchSearchAction}
        />
        <RotatableArrowIcon
          pointing={mq.xs ? "up" : showing === "both" ? "right" : "left"}
          preventRotation
          onClick={resizeScreen}
          ariaLabel={ariaLabels.arrow(mq.xs, showing, true)}
          role="button"
          classNames={classes.arrow(mq.xs, "Down", true)}
        />
      </CardSearchScreenDivision>
      <CardSearchScreenDivision
        classNames={classes.screenDivision(mq.xs, priceClass.current)}
      >
        <PriceScreen prices={prices} name={data.name} priceRef={priceRef} />
        <RotatableArrowIcon
          pointing={mq.xs ? "down" : showing === "both" ? "left" : "right"}
          preventRotation
          onClick={resizeScreen}
          ariaLabel={ariaLabels.arrow(mq.xs, showing, false)}
          role="button"
          classNames={classes.arrow(mq.xs, "Up", false)}
        />
      </CardSearchScreenDivision>
    </div>
  )
}

DescPriceScreen.propTypes = {
  prices: PropTypes.shape({
    averages: PropTypes.arrayOf(
      PropTypes.shape({
        amazon_price: PropTypes.string,
        cardmarket_price: PropTypes.string,
        coolstuffinc_price: PropTypes.string,
        ebay_price: PropTypes.string,
        tcgplayer_price: PropTypes.string
      })
    ),
    sets: PropTypes.arrayOf(
      PropTypes.shape({
        set_code: PropTypes.string,
        set_name: PropTypes.string,
        set_price: PropTypes.string,
        set_rarity: PropTypes.string,
        set_rarity_code: PropTypes.string
      })
    )
  }),
  data: PropTypes.shape({
    id: PropTypes.number,
    attribute: PropTypes.string,
    attributeIcon: PropTypes.string,
    banlist_info: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    atk: PropTypes.number,
    def: PropTypes.number,
    desc: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        image_url: PropTypes.string,
        image_url_small: PropTypes.string
      })
    ),
    level: PropTypes.number,
    link_markers: PropTypes.arrayOf(PropTypes.string),
    link_value: PropTypes.number,
    name: PropTypes.string,
    race: PropTypes.string,
    starArray: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.arrayOf(PropTypes.string)
  }),
  currentList: PropTypes.array.isRequired,
  dispatchSearchAction: PropTypes.func.isRequired
}

export default memo(DescPriceScreen)
