import React from "react"
import { errorMessages } from "../../../utils/utilityObjects"
import styles from "./GenericErrorMessage.module.css"

export default function GenericErrorMessage() {
  // wrap the generic error message in utilityObjects into proper styles and
  // return it
  return <div className={styles.Container}>{errorMessages.genericError}</div>
}
