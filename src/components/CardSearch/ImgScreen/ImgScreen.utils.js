import styles from "./ImgScreen.module.css"

export const classes = {
  container: [styles.Container],
  image: (toastIsActive) =>
    [styles.CardImage, toastIsActive ? styles.CardImageActive : ""].join(" ")
}
