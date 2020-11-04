import React, { useCallback, useRef, useState, memo } from "react"
import PropTypes from "prop-types"
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom"
import Spinner from "../../UI/Spinner/Spinner"
import cardNotFound from "../../../assets/images/cardNotFound.jpg"
import uiConfigs from "../../../utils/ui.configs.json"
import { classes } from "./AltArtImgDisplay.utils"
import styles from "./AltArtImgDisplay.module.css"

function AltArtImgDisplay({
  altImgId // <string> the id of the target image to retrieve from database
}) {
  // boolean and setter to control <Spinner /> loading/unloading
  const [isLoading, setIsLoading] = useState(true)
  // a ref to the image, needed by QuickPinchZoom
  const imgRef = useRef()
  // taken from QuickPinchZoom documentation as is
  const onUpdate = useCallback(({ x, y, scale }) => {
    const { current: img } = imgRef
    if (img) {
      const value = make3dTransformValue({ x, y, scale })
      img.style.setProperty("transform", value)
    }
  }, [])
  // callback on setIsLoading to avoid creating arrow functions in JSX
  const setIsLoadingToFalse = useCallback(() => setIsLoading(false), [
    setIsLoading
  ])

  return (
    <div className={styles.Container}>
      {isLoading && <Spinner classNames={classes.spinner} />}
      <QuickPinchZoom
        onUpdate={onUpdate}
        zoomOutFactor={0}
        minZoom={0.7}
        maxZoom={3}
        onDragStart={setIsLoadingToFalse}
        onZoomStart={setIsLoadingToFalse}
      >
        <img
          ref={imgRef}
          src={
            `${uiConfigs.apiConfigs.cardImgFetchUrl}${altImgId}.jpg` ||
            cardNotFound
          }
          alt={`Alternative Art id ${altImgId}`}
          className={styles.CardImage}
        />
      </QuickPinchZoom>
    </div>
  )
}

AltArtImgDisplay.propTypes = {
  altImgId: PropTypes.string.isRequired
}

export default memo(AltArtImgDisplay)
