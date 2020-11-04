import React from "react"
import MiniCircleWithState from "../../UI/MiniCircleWithState/MiniCircleWithState"
import MiniCircle from "../../UI/MiniCircle/MiniCircle"
import DeckButton from "../DeckButton/DeckButton"
import HelpDemoDrawCards from "../HelpDemoDrawCards/HelpDemoDrawCards"
import { doNothing } from "../../../utils/utilityFunctions"
import uiConfigs from "../../../utils/ui.configs.json"
import deck from "../../../assets/uiIcons/deck.svg"
import addIcon from "../../../assets/uiIcons/add.svg"
import trashIcon from "../../../assets/uiIcons/trash.svg"
import saveIcon from "../../../assets/uiIcons/save.svg"
import deleteIcon from "../../../assets/uiIcons/cross.svg"
import arrow from "../../../assets/uiIcons/arrow2.svg"
import styles from "./HelpSection.module.css"

export const classes = {
  selectionMenu: {
    menu: [styles.SelectionMenuTitles],
    contentItem: [styles.SelectionMenuContentItem]
  },
  genericMiniCircle: [styles.GenericMiniCircle],
  miniCircleWithImages: [styles.MiniCircleWithImages],
  addDeckIcon: [styles.AddDeckIcon, styles.IconImage],
  deleteDeckIcon: [styles.DeleteDeckIcon, styles.IconImage],
  saveDeckIcon: [styles.SaveDeckIcon, styles.IconImage],
  deleteCardIcon: [styles.DeleteCardIcon, styles.IconImage],
  moveCardIcon: [styles.MoveCardIcon, styles.IconImage]
}

export function getSelectionMenuEntries() {
  return getHelpSelectionMenuItems(componentsToRender)
}

// an object with all components getHelpSelectionMenuItems() needs to render
const componentsToRender = {
  getRegularMiniCircleJSX,
  DeckImageJSX: (
    <span className={styles.DeckIcon}>
      <img src={deck} alt="deck icon" />
    </span>
  ),
  StatefulMiniCircleComponent: (
    <MiniCircleWithState
      initialValue={1}
      limit={3}
      animateOnClick
      addNumberColorIndicator
      classNames={classes.genericMiniCircle}
    />
  ),
  AddDeckMiniCircleComponent: getClickableMiniCircleJSX({
    src: addIcon,
    classNames: "addDeckIcon",
    alt: "add"
  }),
  DeleteDeckMiniCircleComponent: getClickableMiniCircleJSX({
    src: trashIcon,
    classNames: "deleteDeckIcon",
    alt: "delete deck"
  }),
  SaveDeckMiniCircleComponent: getClickableMiniCircleJSX({
    src: saveIcon,
    classNames: "saveDeckIcon",
    alt: "save deck"
  }),
  DeckSelectDemoComponent: (
    <DeckButton
      deckId={99999999} // we are never reaching this number as id, safe to use
      canSave={false}
      isActiveDeck={false}
      isDemoComponent
      onClick={() => {}}
    >
      Unloaded deck
    </DeckButton>
  ),
  DeleteCardMiniCircleComponent: getClickableMiniCircleJSX({
    src: deleteIcon,
    classNames: "deleteCardIcon",
    alt: "remove card"
  }),
  MoveCardMiniCircleComponent: getClickableMiniCircleJSX({
    src: arrow,
    classNames: "moveCardIcon",
    alt: "switch sections"
  }),
  CardDrawDemoComponent: <HelpDemoDrawCards />,
  PlusOneMiniCircleComponent: (
    <MiniCircle
      triggerOn
      display="+1"
      animateOnClick
      onClick={doNothing}
      classNames={classes.genericMiniCircle}
    />
  )
}

// attempting to dry code a little bit
function getClickableMiniCircleJSX(imgObj) {
  return (
    <MiniCircle
      triggerOn
      display={
        <img
          src={imgObj.src}
          className={classes[imgObj.classNames].join(" ")}
          alt={imgObj.alt}
        />
      }
      animateOnClick
      onClick={doNothing}
      classNames={classes.miniCircleWithImages}
    />
  )
}

function getRegularMiniCircleJSX(display) {
  return <MiniCircle display={display} classNames={classes.genericMiniCircle} />
}

/**
 * Returns an object whose keys are the titles to be used in <SelectionMenuScreen />,
 * inside <HelpSection />, and their values the JSX to be displayed as content for
 * each of those titles.
 */
function getHelpSelectionMenuItems({
  getRegularMiniCircleJSX, // <function> JSX getter for <MiniCircle /> components
  DeckImageJSX, // <React.node> JSX for deck's SVG <span>
  StatefulMiniCircleComponent, // <React.node> <MiniCircleWithState /> for clickable MiniCircles
  AddDeckMiniCircleComponent, // <React.node> JSX for Add deck's <MiniCircle />
  DeleteDeckMiniCircleComponent, // <React.node> JSX for Delete deck's <MiniCircle />
  SaveDeckMiniCircleComponent, // <React.node> JSX for save deck's <MiniCircle />
  DeckSelectDemoComponent, // <React.node> JSX <DeckButton /> demo component
  DeleteCardMiniCircleComponent, // <React.node> JSX for delete card's <MiniCircle />
  MoveCardMiniCircleComponent, // <React.node> JSX for move card's <MiniCircle />
  CardDrawDemoComponent, // <React.node> JSX <HelpDemoDrawCards />
  PlusOneMiniCircleComponent // <React.node> JSX for "+1"'s <MiniCircle />
}) {
  return {
    intro: [
      <>
        This app will always load a default empty deck if you have no decks
        created. Each deck contains a <b>"Main"</b>, <b>"Side"</b>, and{" "}
        <b>"Extra"</b> sections (where you add cards to create the deck), and a{" "}
        <b>"Test"</b> one (to try drawing cards and check draw ratios).
      </>,
      <>
        <u>Each deck has a name</u>, which appears at the bottom-left corner of
        the screen (or center, if holding the device vertically).{" "}
        <u>Decks can be renamed</u> (check "Edit" section for more
        instructions). You can <b>add</b>, <b>delete</b>, <b>save</b> and{" "}
        <b>load</b> decks by clicking on the "Deck" icon {DeckImageJSX} at the
        left of the deck's name.
      </>,
      <>
        You can <b>add cards to the deck</b> using the card list on the right
        (or bottom, if holding the device vertically). Go to "Filter" section
        for further details.
      </>,
      <>
        <b>Card limits</b> are{" "}
        {getRegularMiniCircleJSX(uiConfigs.deckBuilderConfigs.cardLimits.main)}{" "}
        for <u>main</u> deck,{" "}
        {getRegularMiniCircleJSX(uiConfigs.deckBuilderConfigs.cardLimits.side)}{" "}
        for <u>side</u> deck and{" "}
        {getRegularMiniCircleJSX(uiConfigs.deckBuilderConfigs.cardLimits.extra)}{" "}
        for <u>extra</u> deck.
      </>
    ],
    edit: [
      <>
        <article> Adding, deleting, saving and loading decks </article>
      </>,
      <>
        First, tap the "Deck" icon {DeckImageJSX} at the left of the deck's name
        to trigger a screen that controls all those options. A list with all
        your saved decks will appear, as well as <u>add</u>, <u>delete</u> and{" "}
        <u>save</u> deck sub-sections.
      </>,
      <>
        You can <b>add a deck</b> by clicking on add icon{" "}
        {AddDeckMiniCircleComponent} , provided you did not surpass the maximum
        limit of{" "}
        {getRegularMiniCircleJSX(uiConfigs.deckBuilderConfigs.maxDecksAmount)}{" "}
        decks.
      </>,
      <>
        <b>Delete a deck</b> by selecting a deck on the list and then hitting
        the "delete" icon {DeleteDeckMiniCircleComponent} .
      </>,
      <>
        If you made at least one change to a previously saved deck (renamed it,
        added/removed cards), the "save" option will become available.{" "}
        <b>Save the deck</b> by tapping the "save" icon{" "}
        {SaveDeckMiniCircleComponent}. <u>Keep in mind</u> that if you
        load/create a new deck without saving the current one,{" "}
        <u>changes will be lost!</u>
      </>,
      <>
        Lastly, <b>load a deck</b> by clicking twice on its name inside the deck
        list.
      </>,
      <>
        <div>{DeckSelectDemoComponent}</div>
      </>,
      <>
        Same scenario as saving a deck, if you do not want changes on the
        current deck to be lost, <u>make sure to save first</u>.
      </>,
      <>
        <article> Renaming decks </article>
      </>,
      <>
        You can double click on the deck's name next to "Deck" menu icon{" "}
        {DeckImageJSX} to trigger <b>name edit mode</b>, which enables you to
        rename the deck.
      </>,
      <>
        Maximum <u>character limit is</u>{" "}
        {getRegularMiniCircleJSX(
          uiConfigs.deckBuilderConfigs.maxDeckNameCharLength
        )}
        , and you can use alphanumerical english characters as well as various
        symbols.
      </>,
      <>
        Again, <u>make sure to save the deck to persist its name changes.</u>
      </>,
      <>
        <article>Modifying cards in deck</article>
      </>,
      <>
        An added card in "main", "side" or "extra" sections can be clicked.
        Doing so will display three options: <u>card quantity in section</u>,{" "}
        <u>delete</u> and <u>switch section</u>.
      </>,
      <>
        Tapping on the <b>quantity circle</b> {StatefulMiniCircleComponent} will
        increase the card quantity in that section by 1. Notice that the{" "}
        <u>will not increase beyond a maximum of 3</u>, and this counts the
        copies of that same card across the whole deck. If the card quantity
        exceeds 3, <u>it will loop back to 1</u>.
      </>,
      <>
        <b>"Delete"</b> {DeleteCardMiniCircleComponent} option does exactly
        that: it removes the selected card from the current section. It will not
        affect copies of that same card in other sections (deleting "Dark
        Magician" in "main" will not affect "Dark Magician" in "side").
      </>,
      <>
        Finally, <b>"switch sections"</b> {MoveCardMiniCircleComponent} option
        moves a copy of the card to its valid opposite section. E.g.:
        "switching" Sangan from "side" deck will move it to "main" deck, and
        vice-versa. If there were 2 copies of "Sangan" in "side", 1 will be
        moved to "main".
      </>
    ],
    test: [
      <>
        <article> Introduction to testing </article>
      </>,
      <>
        <b>"Test"</b> section allows you to draw hypothetical cards/hands from
        current "main" deck, as well as shuffling the deck to see all cards in
        random order.
      </>,
      <>
        Percentage ratios of the type of card you have the chance to draw next
        -as well as draw ratios of each individual card- will be displayed and
        will dynamically change as you draw cards.{" "}
      </>,
      <>
        Draw ratios are calculated using each card type's quantity (or each card
        name's quantity), over the total amount of cards. Try card type draw
        chance by tapping the icons:
      </>,
      <>{CardDrawDemoComponent}</>,
      <>
        <article> Must-knows </article>
      </>,
      <>
        For "Test" section to work,{" "}
        <u>the active deck must have at least one card in the "main" section</u>
        . Maximum card limit in "Test" always reflects "Main"'s.{" "}
      </>,
      <>
        Keep in mind drawing cards or shuffling the deck in this section{" "}
        <u>will NOT affect cards in "main" deck</u>.
      </>,
      <>
        <article> How to test the deck </article>
      </>,
      <>
        Tap <b>"Draw 1"</b> and <b>"Draw 5"</b> icons to simulate a single drawn
        card or a standard hand.{" "}
      </>,
      <>
        <b>Shuffle</b> icon takes all cards in "main" deck, randomizes them and
        displays a hypothetical order of a shuffled deck.
      </>,
      <>
        <b>Reset</b> clears all drawn cards or shuffled deck (resets the
        section), which will allow you to draw newly random cards from the
        "main" deck.{" "}
      </>
    ],
    filter: [
      <>
        <article>Basics</article>
      </>,
      <>
        First thing first, notice that{" "}
        <b>this section will not work if you are not connected to internet</b>.
      </>,
      <>
        <b>Card filter</b> section is in the right half of the screen (or
        bottom, if device is held vertically).{" "}
        <u>
          You use filtering to search for any one card in the whole Yugioh card
          database to add them to "main", "side" and "extra" sections of the
          active deck
        </u>
        .
      </>,
      <>
        When you loaded this app, all cards were requested from the database,
        and hopefully stored as a list in this section.
      </>,
      <>
        If you have no connection, you might still load, delete, save and add
        new decks, but you will not be able to add new cards to it.
      </>,
      <>
        <article>Adding cards to deck</article>
      </>,
      <>
        Once the <b>"success"</b> message is shown on screen, type a sequence of
        3 or more characters of any card's name in "Filter list" search box for
        filtering to occur.
      </>,
      <>
        If there was at least one match, any card with those sequential
        characters on its name will appear in the list.{" "}
        <u>Tap on the desired card and a circle with "+1" on it will appear</u>{" "}
        {PlusOneMiniCircleComponent} .
      </>,
      <>
        <u>
          Hitting that circle will add the card on the current selected deck
          section, or its default one
        </u>{" "}
        ("main" or "side"), depending on the card type if you are to add a card
        on a section that does not match its correct one (e.g.: trying to add a
        Synchro monster on "main" deck will default to adding it to "extra"
        deck).
      </>,
      <>
        Also,{" "}
        <u>
          the card will not be added if the maximum card limit of that card was
          reached in the whole deck, or if it is an unplayable card
        </u>{" "}
        (like a token or skill card).
      </>
    ]
  }
}
