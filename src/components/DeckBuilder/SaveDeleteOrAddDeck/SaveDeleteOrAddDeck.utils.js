import add from "../../../assets/uiIcons/add.svg"
import save from "../../../assets/uiIcons/save.svg"
import trash from "../../../assets/uiIcons/trash.svg"
import styles from "./SaveDeleteOrAddDeck.module.css"

export const classes = {
  title: (propsClassNames) => [styles.Title, propsClassNames?.join(" ")],
  spinner: (propsClassNames) => ({
    container: [styles.SpinnerContainer, propsClassNames?.join(" ")]
  }),
  miniCircle: (propsClassNames) => [
    styles.MiniCircle,
    propsClassNames?.join(" ")
  ],
  miniCircleImg: (isDeleteDeckComponent, isAddDeckComponent, propsClassNames) =>
    [
      styles.MiniCircleImg,
      isDeleteDeckComponent
        ? [styles.DeleteMiniCircle]
        : isAddDeckComponent
        ? [styles.AddMiniCircle]
        : null,
      propsClassNames?.join(" ")
    ].join(" "),
  disabledText: (propsClassNames) =>
    [styles.DisabledText, propsClassNames?.join(" ")].join(" ")
}

export function getComponentProperties(isSave, isDelete, isAdd) {
  if (isSave)
    return {
      title: "Save current",
      src: save,
      alt: "save image",
      operation: "saving",
      disabledText: "Current working deck is saved"
    }
  if (isDelete)
    return {
      title: "Delete selected",
      src: trash,
      alt: "delete image",
      operation: "deleting",
      disabledText: 'Select a deck on "Deck select" to delete'
    }
  if (isAdd)
    return {
      title: "Add new",
      src: add,
      alt: "add image",
      operation: "adding",
      disabledText: "Maximum deck limit reached"
    }
}
