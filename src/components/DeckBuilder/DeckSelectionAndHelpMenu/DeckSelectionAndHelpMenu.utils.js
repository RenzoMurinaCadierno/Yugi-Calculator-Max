import uiConfigs from "../../../utils/ui.configs.json"
import styles from "./DeckSelectionAndHelpMenu.module.css"

export const classes = {
  helpSvgComponent: {
    container: [styles.SVGDeckContainer, styles.SVGHelpContainer],
    text: [styles.SVGHelpText]
  },
  editableSpan: {
    container: [styles.InputWithSubmitContainer],
    input: [styles.InputWithSubmitInput],
    charLimit: [styles.InputWithSubmitCharLimit],
    span: [styles.DeckTitleSpan]
  }
}

export const editableSpanConfigs = {
  showCharLimit: true,
  delayBetweenTaps: uiConfigs.timeouts.doubleTapDelay,
  maxCharLength: uiConfigs.deckBuilderConfigs.maxDeckNameCharLength,
  spanAriaLabel: "Deck name. Double click to edit"
}

export const inputWithSubmitExtraProps = {
  ariaLabel: "Type deck name and submit it here",
  preventDefault: true,
  autoComplete: "off"
}
