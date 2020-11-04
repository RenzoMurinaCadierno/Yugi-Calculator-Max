import styles from "./DeckCreatorSideBar.module.css"

export const classes = {
  mainSideExtra: {
    monster: getClasses("Monster"),
    spell: getClasses("Spell"),
    trap: getClasses("Trap"),
    fusion: getClasses("Fusion"),
    synchro: getClasses("Synchro"),
    xyz: getClasses("XYZ"),
    pendulum: getClasses("Pendulum"),
    link: getClasses("Link")
  },
  test: {
    draw_1: getClasses("Draw-1", true),
    draw_5: getClasses("Draw-5", true),
    shuffle: getClasses("Shuffle", true),
    reset: getClasses("Reset", true)
  }
}

function getClasses(cardType, isTestComponent) {
  return {
    container: [styles.SVGImageContainer],
    image: [styles[cardType], styles.SVGImageImage],
    text: [styles.SVGImageText, isTestComponent ? styles.TestText : ""]
  }
}
