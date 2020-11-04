import React, { useEffect, useContext, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { MediaQuery } from "../../../contexts/MediaQueryContext"
import { DeckBuilderContext } from "../../../contexts/DeckBuilderContext"
import * as deckConstructorActionCreators from "../../../store/DeckConstructor/deckConstructorActionCreators"
import DeckBuilderTopScreen from "../../../wrappers/DeckBuilderTopScreen/DeckBuilderTopScreen"
import DeckBuilderBottomScreen from "../../../wrappers/DeckBuilderBottomScreen/DeckBuilderBottomScreen"
import HalfScreenDivision from "../../../wrappers/HalfScreenDivision/HalfScreenDivision"
import SelectionMenuScreen from "../../UI/SelectionMenuScreen/SelectionMenuScreen"
import DeckCreatorSideBar from "../DeckCreatorSideBar/DeckCreatorSideBar"
import DeckSelectionAndHelpMenu from "../DeckSelectionAndHelpMenu/DeckSelectionAndHelpMenu"
import {
  classes,
  getCardListItemsJSXPerDeckSection,
  getCustomDeckSectionTitles,
  getCardQuantityPerDeckSection
} from "./DeckCreatorScreen.utils"
import arrowSVG from "../../../assets/uiIcons/arrow2.svg"
import crossSVG from "../../../assets/uiIcons/cross.svg"

function DeckCreatorScreen({
  playSFXs // <boolean> global ON/OFF state for SFXs, in UIContext
}) {
  // bring needed states and functions from DeckBuilderContext
  const {
    deckState,
    cardCache,
    dispatchDeckAction,
    triggerCardDetailsToast
  } = useContext(DeckBuilderContext)
  // screen division components modify inline styles according to device orientation
  const { mq } = useContext(MediaQuery)

  const handleModifyCardQuantity = useCallback(
    (cardObj) => {
      dispatchDeckAction(deckConstructorActionCreators.addCard(cardObj))
    },
    [dispatchDeckAction]
  )

  const handleRemoveCardFromList = useCallback(
    (cardName) => {
      dispatchDeckAction(deckConstructorActionCreators.removeCard(cardName))
    },
    [dispatchDeckAction]
  )

  const handleChangeCurrentDeckSection = useCallback(
    (e) => {
      dispatchDeckAction(
        // use customTitle's data-id as deck section name
        deckConstructorActionCreators.changeSection(e.target.dataset.id)
      )
    },
    [dispatchDeckAction]
  )

  const handleMoveCardBetweenSections = useCallback(
    (cardName, deckSectionName) => {
      dispatchDeckAction(
        deckConstructorActionCreators.moveCardBetweenSections(
          cardName,
          deckSectionName
        )
      )
    },
    [dispatchDeckAction]
  )

  useEffect(() => {
    // SelectionMenuScreen component will always fall back to first title on
    // mount phase, being "Main", so sync state to point to that section.
    // Also, when unmounting this component (root level after page), then
    // re-sync it to "Main". This is such because if we unmount it from "Test",
    // then when we re-mount it, "Animated Number" from CardListStatSVG will
    // start counting up, and instantly unmount. SetState there will be active
    // when that component unmounts. That is a memory leak.
    dispatchDeckAction(deckConstructorActionCreators.changeSection("main"))
    return () => {
      dispatchDeckAction(deckConstructorActionCreators.changeSection("main"))
    }
  }, [dispatchDeckAction])

  useEffect(() => {
    // each time a card is added/removed/moved between sections, re-sort the
    // array to keep its order
    if (deckState.sectionWasModified) {
      dispatchDeckAction(deckConstructorActionCreators.sortSection())
    }
  }, [deckState.sectionWasModified, dispatchDeckAction])

  useEffect(() => {
    // since main deck constantly changes, "test" section will display different cards
    // each time. So, whenever we click on it, re-initialize it to reflect changes
    if (deckState.selectedDeckSection === "test") {
      dispatchDeckAction(deckConstructorActionCreators.intitializeTestDeck())
    }
  }, [
    deckState.selectedDeckSection,
    deckState.selectedDeckId,
    dispatchDeckAction
  ])

  // last key in deckState's "deck_" objects is the deck's name, which is a string.
  // Remove it. For everything down below to work, we only need the sections "main",
  // "side", "extra" as arrays.
  const deckSections = Object.entries(
    deckState[`deck_${deckState.selectedDeckId}`]
  ).slice(0, -1)
  // get an object with each section as keys and their card quantities as values
  // e.g.: {"main": 40, "side": 10, "extra": 5}
  const cardQuantityPerSection = getCardQuantityPerDeckSection(deckSections)
  // using all data passed as args, construct an object with each section as keys
  // (same as above), but a list of <CardListItem /> components for each card
  // each section holds
  const cardListItemsKeyValArray = getCardListItemsJSXPerDeckSection(
    deckSections,
    crossSVG,
    arrowSVG,
    handleModifyCardQuantity,
    handleRemoveCardFromList,
    handleMoveCardBetweenSections,
    triggerCardDetailsToast,
    cardCache.length
  )
  // since we are not using plain text titles for <SelectionMenuScreen />, construct
  // the components to use on their place
  const customTitles = getCustomDeckSectionTitles(
    deckSections,
    cardQuantityPerSection,
    classes.miniCircle
  )

  return (
    <>
      <DeckBuilderTopScreen
        ariaLabel="Deck creation screen. Select a section here and move cards from Card List section using the +1 option there"
        classNames={classes.deckBuilderTopScreen}
      >
        <HalfScreenDivision
          ariaLabel="Deck/Side/Extra sections"
          width={mq.portrait ? 100 : 90}
          height={mq.portrait ? 88 : 100}
        >
          <SelectionMenuScreen
            ulContentAreLiTags
            items={cardListItemsKeyValArray}
            customTitles={customTitles}
            playSFXs={playSFXs}
            animation="li-items-slide"
            onMenuItemClick={handleChangeCurrentDeckSection}
            forceSelectDefault={deckState.selectedDeckId} // each time we change deck, auto-select default title
            defaultTitle="main" // and let that default title be "main", first one
            classNames={classes.selectionMenu}
          />
        </HalfScreenDivision>
        <HalfScreenDivision
          ariaLabel="Options"
          width={mq.portrait ? 98 : 10}
          height={mq.portrait ? 12 : 100}
          classNames={classes.deckCreatorSideBar}
        >
          <DeckCreatorSideBar
            deckState={deckState}
            dispatchDeckAction={dispatchDeckAction}
            playSFXs={playSFXs}
          />
        </HalfScreenDivision>
      </DeckBuilderTopScreen>
      <DeckBuilderBottomScreen
        ariaLabel="Deck selection and help screen."
        classNames={classes.deckBuilderBottomScreen}
      >
        <DeckSelectionAndHelpMenu
          canSave={deckState.canSave}
          deckId={deckState.selectedDeckId}
          deckOneNameChange={deckState.deck_1?.name} // re-render on first deck name change
          selectedDeckName={deckState[`deck_${deckState.selectedDeckId}`].name}
          playSFXs={playSFXs}
          dispatchDeckAction={dispatchDeckAction}
        />
      </DeckBuilderBottomScreen>
    </>
  )
}

DeckCreatorScreen.propTypes = {
  playSFXs: PropTypes.bool.isRequired
}

export default memo(DeckCreatorScreen)
