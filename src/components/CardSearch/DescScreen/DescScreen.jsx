import React, { useContext, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { UIContext } from "../../../contexts/UIContext"
import * as cardSearchActionCreators from "../../../store/CardSearch/cardSearchActionCreators"
import * as toastActionCreators from "../../../store/Toast/toastActionCreators"
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon"
import { isMonsterCard } from "../../../utils/yugiohSpecificFunctions"
import sword from "../../../assets/cardIcons/sword.svg"
import shield from "../../../assets/cardIcons/shield.svg"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./DescScreen.utils"
import styles from "./DescScreen.module.css"

function DescScreen({
  data, // <object> searchReducer's "currentCard" object's "data" value
  showing, // <string> "right" for card details, "left" for card prices, and "both" for both split in half
  cardDescRef, // <React.createRef> a reference to the outermost elements besides the container
  dispatchSearchAction // <function> searchReducer's action dispatcher
}) {
  // spread all keys coming from "data" object
  const {
    atk,
    def,
    banlist_info = [],
    desc,
    link_markers = [],
    link_value,
    level,
    starArray,
    images,
    name,
    race,
    type,
    attribute,
    attributeIcon
  } = data
  // grab <SecondaryScreen /> toggler. We need it to trigger <AltArtImgDisplay />.
  // Also, <Toast /> will fire if no internet connection. So grab its dispatcher
  const { toggleSecondScreen, dispatchToastAction } = useContext(UIContext)

  // if the card has a link value, show "LINK" plus its number value on a <span>
  // Otherwise, if the card is a monster and xyz, show "RANK" and its rank number
  // finally, if it is any other monster, show "LEVEL" and its level number
  const linkLevelOrRankValue = link_value
    ? "LINK " + link_value
    : type && type[0] === "XYZ Monster"
    ? "RANK " + level
    : "LEVEL " + level

  // when a card art is requested, set its id as a state, which will be used in
  // AltArtImgDisplay component to fetch the art from the database and show it
  // in a modal screen.
  // If there is no internet connection, ignore everything. Instead, show a
  // <Toast /> warning of not internet connection
  const handleAltImgClick = useCallback(
    (e) => {
      if (navigator.onLine) {
        dispatchSearchAction(
          cardSearchActionCreators.setAltImgId(e.target.dataset.id)
        )
        toggleSecondScreen(uiConfigs.togglers.secondaryScreens.altCardArt)
      } else {
        dispatchToastAction(
          toastActionCreators.setToastState(
            null,
            null,
            uiConfigs.togglers.toast.noConnection
          )
        )
      }
    },
    [
      dispatchSearchAction,
      toggleSecondScreen,
      dispatchToastAction,
      navigator.onLine
    ]
  )

  // creates the array that in term will graphically display link markers,
  // or XYZ stars or level stars svgs
  const getLinkLevelOrRankArrayJSX = useCallback(() => {
    let isLink = false
    let linkLevelOrRankArray = []
    // if link_markers is not undefined, we are dealing with a LINK monster,
    // use link_markers as the array to map. On any other case, use starArray
    // which will hold the correct star svg icon for XYZ or any other monster
    if (link_markers.length) {
      linkLevelOrRankArray = link_markers
      isLink = true
    } else {
      linkLevelOrRankArray = starArray
    }
    // when showing card info and price screens, the space becomes cluttered,
    // so, instead of reducing the size of the stars, just show <number> x <starIcon>.
    // Otherwise, we have a screen with sufficient space, show all stars
    return linkLevelOrRankArray.length > 9 && showing === "both" ? (
      <>
        <p>{linkLevelOrRankArray.length} x</p>
        <ArrowIcon
          arrowImage={linkLevelOrRankArray[0]}
          pointing={null}
          alt={"Star"}
          classNames={classes.collapsedStarIcons}
        />
      </>
    ) : (
      linkLevelOrRankArray.map((item, i) => (
        <ArrowIcon
          key={i}
          arrowImage={isLink ? null : item}
          pointing={isLink ? item : null}
          alt={isLink ? "" : "Star"}
          classNames={classes.expandedStarIcons(isLink)}
        />
      ))
    )
  }, [link_markers, starArray])

  return (
    <div className={styles.Container}>
      {/* span with a ref to scroll into view, card name, and type */}
      <span ref={cardDescRef} />
      <div> {name} </div>
      <div className={styles.Type} style={{ color: `${type && type[1]}` }}>
        {type && type[0]}
      </div>
      {/* race and attribute */}
      <div className={styles.RaceAttrib}>
        <div> {race} </div>
        <img src={attributeIcon} alt={attribute} />
      </div>
      {/* if the card "type" is "monster", show its level/link markers/rank,
      attack and defense (with their icons) */}
      {type && isMonsterCard(type[0]) && (
        <>
          <div className={classes.linkLevelOrRank(level, showing)}>
            <span>{linkLevelOrRankValue}</span>
            {getLinkLevelOrRankArrayJSX()}
          </div>
          <div className={styles.AtkDef}>
            <div>
              <img src={sword} alt="Attack" className={styles.SwordIcon} />
              {atk}
            </div>
            {type[0] !== "Link Monster" && (
              <div>
                <img src={shield} alt="Defense" className={styles.ShieldIcon} />
                {def || 0}
              </div>
            )}
          </div>
        </>
      )}
      {/* card's description or flavor text */}
      <div className={styles.Description} aria-label="Card text">
        {desc && desc.map((sentence, i) => <div key={i}> {sentence} </div>)}
      </div>
      {/* cards banlist status for ocs and tcg */}
      <div className={styles.Banlist} aria-label="Banlist status">
        {banlist_info.map((b, i) => (
          <div key={i}>
            {b[0]} <span> {b[1]} </span>
          </div>
        ))}
      </div>
      {/* original arts and alternative ones */}
      <ul className={styles.AltArtList}>
        <span className={styles.AltArtTitle}> Card art </span>
        {images.map((image, i) => (
          <li
            key={image.id}
            data-id={image.id}
            className={styles.AltArtImg}
            onClick={handleAltImgClick}
          >
            {i === 0 ? `Original art` : `Alternative art ${i}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

DescScreen.propTypes = {
  showing: PropTypes.string.isRequired,
  cardDescRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  dispatchSearchAction: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    attribute: PropTypes.string,
    attributeIcon: PropTypes.string,
    banlist_info: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    atk: PropTypes.number,
    def: PropTypes.number,
    desc: PropTypes.arrayOf(PropTypes.string),
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
  })
}

export default memo(DescScreen)
