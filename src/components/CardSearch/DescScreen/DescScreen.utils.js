import styles from "./DescScreen.module.css"

export const classes = {
  collapsedStarIcons: {
    container: [styles.ArrowIconContainer, styles.ContainerFilled],
    arrow: [styles.ArrowIconArrow]
  },
  expandedStarIcons: (isLink) => ({
    container: [
      styles.ArrowIconContainer,
      isLink ? "" : styles.ContainerFilled
    ],
    arrow: [styles.ArrowIconArrow]
  }),
  linkLevelOrRank: (level, showing) =>
    [
      styles.LinkInfoContainer,
      level > 9 && showing === "both" ? styles.CompressLinkInfoContainer : ""
    ].join(" ")
}
