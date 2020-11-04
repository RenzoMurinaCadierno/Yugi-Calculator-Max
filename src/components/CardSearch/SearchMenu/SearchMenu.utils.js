import styles from "./SearchMenu.module.css"

export const classes = {
  inputWithLabel: {
    container: [styles.InputContainer]
  },
  spinner: {
    container: [styles.SpinnerContainer]
  }
}

const globalbuttonStyles = {
  color: "#2f7ed8",
  letterSpacing: "0.1rem",
  position: "relative",
  fontStyle: "italic",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 250ms ease"
}

export const inlineStyles = {
  searchButton: globalbuttonStyles,
  helpButton: {
    ...globalbuttonStyles,
    color: "#6338ff"
  },
  searchIcon: (isLoading, searchTerm) =>
    isLoading || searchTerm.length < 2
      ? { filter: "grayscale(100%)" }
      : { filter: "unset" }
}

export function getInputTexts(isInListScreen, currentList) {
  return isInListScreen && currentList.length
    ? [
        'Type to filter or "Search" for new results',
        'Type to filter or "Search" for new results',
        "Search / Filter mode",
        "Search / Filter mode"
      ]
    : [
        "Search for card's full or partial name",
        "E.g. Blue-Eyes White Dragon or Blue-Eyes",
        "Search mode",
        "Search mode"
      ]
}
