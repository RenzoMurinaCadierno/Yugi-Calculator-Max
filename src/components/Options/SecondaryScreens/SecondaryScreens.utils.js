import styles from "./SecondaryScreens.module.css"

export const classes = {
  expandableIcon: (site, large) => ({
    container: [
      styles.IconContainer,
      styles[`Icon${site[0].toUpperCase() + site.slice(1)}`]
    ],
    content: [large ? styles.IconContentLarge : ""],
    icon: [
      styles.IconImage,
      large
        ? [
            styles.FixIconImage,
            styles[`Icon${site[0].toUpperCase() + site.slice(1)}Fixed`]
          ].join(" ")
        : ""
    ],
    expandContainer: [
      styles.ExpandIconContainer,
      large ? styles.LargeContainer : ""
    ]
  })
}
