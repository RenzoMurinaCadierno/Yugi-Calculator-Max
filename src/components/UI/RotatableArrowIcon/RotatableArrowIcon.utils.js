import styles from "./RotatableArrowIcon.module.css"

export const classes = {
  container: (propsClassNames) =>
    [styles.Container, propsClassNames?.join(" ")].join(" "),
  image: (direction, isArrowRotated, preventRotation, propsClassNames) =>
    [
      styles.ArrowImage,
      isArrowRotated && !preventRotation // is rotation is not prevented:
        ? styles[direction + "Rotation"] // arrow is rotated, add className + Rotation
        : styles[direction], // arrow is not rotated or rotation is prevented, use className onlu
      propsClassNames?.join(" ")
    ].join(" ")
}
