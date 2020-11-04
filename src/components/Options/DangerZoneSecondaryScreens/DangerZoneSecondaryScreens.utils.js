import React from "react"
import uiConfigs from "../../../utils/ui.configs.json"
import Button from "../../UI/Button/Button"
import tick from "../../../assets/uiIcons/tick.svg"
import cross from "../../../assets/uiIcons/cross.svg"

/**
 * dangerZoneChildrenJSX's helper object with JSX getter functions. Just to dry code
 */
const dangerZoneChildrenInnerJSX = {
  proceedButton: (classes, styles, onClick, disabled) => (
    <Button
      type={disabled ? "disabled" : "primary"}
      disabled={disabled}
      classNames={classes.button}
      onClick={onClick}
    >
      Proceed
      <img
        className={disabled ? styles.TickImageDisabled : styles.TickImage}
        src={tick}
        alt="confirm"
      />
    </Button>
  ),
  cancelButton: (classes, styles, onClick) => (
    <Button type="secondary" classNames={classes.button} onClick={onClick}>
      Cancel
      <img className={styles.CancelImage} src={cross} alt="cancel" />
    </Button>
  )
}

/**
 * <DangerZoneSecondaryScreen />'s object with JSX getter functions
 */
export const dangerZoneChildrenJSX = {
  getRefetchCardsJSX: ({
    styles, // <object> styles object (created by importing css modules)
    classes, // <object> classes object manually created inside the component
    onProceed, // <function> onProceed's callback
    onCancel, // <function> onCancel's callback
    proceedDisabled // <boolean> on true, proceed button should disable
  }) => (
    <>
      <div className={styles.Title}> Reload Deck Builder's card list</div>
      <div className={styles.Content}>
        You are attempting to re-fetch from YGORPODeck's database the card list
        being used to create decks in Deck Builder ("Decks") section.
      </div>
      <div className={styles.Content}>
        If you succeed, all cards in the database will be restored to the card
        selection area of that section (it should work if you can read "Cards
        loaded!" there). All card prices loaded from card "info" will be updated
        too.
      </div>
      <div className={[styles.Content, styles.Center].join(" ")}>
        <span className={styles.Important}>Warning!</span>
        <br />
        <strong>Do not do this frequently.</strong>{" "}
      </div>
      <div className={styles.Content}>
        If you abuse this feature,{" "}
        <b>YGOPRODeck's servers can blacklist your IP address</b>, thus
        preventing your device from accessing card data and restricting this
        app's experience for you.{" "}
      </div>
      <div className={styles.Content}>
        Cards should have loaded by default when you opened the app, so unless
        you got an error and you need to refresh the card list, do not proceed.
      </div>
      <div className={styles.Content}>
        If you do so, keep in mind that{" "}
        <u>this operation requires you to be connected to internet</u>, and
        could take some seconds (you are retrieving data of 10.000+ cards).
        Also, once you restore the list,{" "}
        <strong>
          this option will be blocked for{" "}
          {Number.parseInt(
            uiConfigs.apiConfigs.cardRefetchBlockTimeout / 1000 / 60
          )}{" "}
          minutes
        </strong>{" "}
        as not to overload YGOPRODeck's servers.
      </div>
      <div className={styles.Buttons}>
        {dangerZoneChildrenInnerJSX.proceedButton(
          classes,
          styles,
          onProceed,
          proceedDisabled
        )}
        {dangerZoneChildrenInnerJSX.cancelButton(classes, styles, onCancel)}
      </div>
    </>
  ),
  getResetAppJSX: ({
    styles, // <object> styles object (created by importing css modules)
    classes, // <object> classes object manually created inside the component
    onProceed, // <function> onProceed's callback
    onCancel, // <function> onCancel's callback
    proceedDisabled // <boolean> on true, proceed button should disable
  }) => (
    <>
      <div className={styles.Title}>Reset app</div>
      <div className={styles.Content}>
        By proceeding, all of these changes will apply:
      </div>
      <ul className={styles.List}>
        <li>
          Calculator will be reset (current life points are to be restored to
          their default, as well as coin, dice, token and timer screens).
        </li>
        <li>Log history will be cleared.</li>
        <li>
          Deck builder section will be cleaned up (all decks there are to be
          removed).
        </li>
        <li>
          Customized initial life points, log/SFX switches and dice roll ranges
          will be restored to default.
        </li>
      </ul>
      <div className={[styles.Content, styles.Center].join(" ")}>
        <span className={styles.Important}>Warning!</span>
        <br />
        <strong>This action cannot be reverted.</strong>
      </div>
      <div className={styles.Content}>
        Make sure this is what you want to do before continuing. Once you
        commit, there is no way back.
      </div>
      <div className={styles.Buttons}>
        {dangerZoneChildrenInnerJSX.proceedButton(
          classes,
          styles,
          onProceed,
          proceedDisabled
        )}
        {dangerZoneChildrenInnerJSX.cancelButton(classes, styles, onCancel)}
      </div>
    </>
  )
}
