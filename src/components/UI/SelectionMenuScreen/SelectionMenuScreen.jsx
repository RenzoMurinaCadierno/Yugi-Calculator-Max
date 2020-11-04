import React, { useState, useEffect, useRef, memo } from "react"
import PropTypes from "prop-types"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import useAudio from "../../../hooks/useAudio"
import switchTitlesmp3 from "../../../assets/audios/switchTitles.mp3"
import { classes, inlineStyles } from "./SelectionMenuScreen.utils"

function SelectionMenuScreen({
  items = {}, // <object> (must) object to map titles and content. Shape {<string>: <string>}
  playSFXs, // <object> (must) useAudio() sfx object to assign to titles
  customTitles, // <object> (optional) shape {<string>: <li>} keys MUST MATCH keys in items, and MUST have data-id set to the key string!
  ulContentAreLiTags, // <boolean> (optional) set it to true if items object's values are custom <li>s.
  animation, // <string> (optional) the animation class name to add to <li>. Must match the ones in this component's CSS module.
  onMenuItemClick, // <function> (optional) callback that triggers when clicking on titles
  forceSelectDefault, // <any> (optional observer) if this value mutates, defaultTitle assigned below will be automatically selected.
  defaultTitle, // <string> (optional) the name of the title (of one key in "items" object) to force select with boolean above
  classNames = {} // <object> classNames object. Check propTypes below for its constitution
}) {
  // if we are passing "customTitles" object grab titles from its entries {key: <title>}.
  // Otherwise, get all titles from "items" object keys
  const titlesArray = customTitles
    ? Object.entries(customTitles)
    : Object.keys(items)

  // state to handle the selected title. Set the first option as starting selection
  const [currentOption, setCurrentOption] = useState(
    customTitles ? titlesArray[0][0] : titlesArray[0]
  )
  // ref to scroll the content into view
  const contentItemRef = useRef()
  // useAudio() hook for "switching titles" sfx (JSX and SFX controles object)
  const [switchTitlesAudioJSX, switchTitlesSFX] = useAudio(switchTitlesmp3, {
    toggleOn: playSFXs,
    playbackRate: 1.5
  })

  const handleMenuItemClick = (e) => {
    // on a menu option click, play its SFX, set state to deactivate the
    // previous selection and activate the target one. If there is a
    // callback assigned to menu items, trigger it passing the event object
    switchTitlesSFX.play()
    setCurrentOption(e.target.dataset.id)
    onMenuItemClick && onMenuItemClick(e)
  }

  useEffect(() => {
    // forceSelectDefault is an optional observer state passed in props.
    // If it exists, each time it mutates and the current active title is not
    // the one set as default title, force select that default title
    forceSelectDefault &&
      currentOption !== defaultTitle &&
      setCurrentOption(defaultTitle)
  }, [forceSelectDefault])

  useEffect(() => {
    // scroll into view when switching options
    contentItemRef.current.scrollIntoView({ behavior: "smooth" })
  }, [currentOption])

  return (
    <div className={classes.container(classNames.container)}>
      <ul className={classes.menu(classNames.menu)}>
        {titlesArray.map((title, i) =>
          // if no customTitles were passed, we are working with regular string titles.
          // map them into valid <li> tags
          !customTitles ? (
            <li
              key={i}
              data-id={title}
              onClick={
                // when switching to a new active title that's not the current
                // one, play the toggle SFX, set this new title as active and if
                // there was a callback assigned, trigger it
                title === currentOption ? null : handleMenuItemClick
              }
              // current active title gets styles.Active
              className={classes.menuItem(
                title,
                currentOption,
                classNames.menuItem
              )}
              // each title title share the same width
              style={inlineStyles.menuItem(titlesArray)}
            >
              {title}
            </li>
          ) : (
            // we are mapping custom titles, on an array where
            // titles are [title string, custom li children]
            <li
              key={i}
              data-id={title[0]}
              onClick={title[0] === currentOption ? null : handleMenuItemClick}
              className={classes.menuItem(
                title[0],
                currentOption,
                classNames.menuItem
              )}
              style={inlineStyles.menuItem(titlesArray)}
            >
              {title[1]} {/* use default <li> content here */}
            </li>
          )
        )}
      </ul>
      {
        // Listen to boolean. if we are passing custom <li>s as content, then use those.
        // Otherwise, create one <li> and insert what's coming from content there.
        // This component will always inject styles for <li>s (custom or not)
        ulContentAreLiTags ? (
          <div
            ref={contentItemRef}
            className={classes.content(classNames.content)}
          >
            {
              // are we passing an animation className string? If so, render a TransitionGroup
              // component, and all <li> tags wrapped with CSSTransition using "animation" as
              // classNames. It must match a class name inside this components CSS module file,
              animation ? (
                <TransitionGroup
                  component="ul"
                  style={{ margin: 0, padding: 0 }}
                >
                  {items[currentOption].map((item) => (
                    <CSSTransition
                      key={item.key}
                      component={null}
                      timeout={250}
                      classNames={animation}
                      mountOnEnter
                      unmountOnExit
                    >
                      {item}
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              ) : (
                // we are not passing an "animation" string, so just render the custom <li> tags
                items[currentOption].map((item) => (
                  <React.Fragment key={item.key}> {item} </React.Fragment>
                ))
              )
            }
          </div>
        ) : (
          // content is an array of plain text elements, render them as <li>, injecting
          // generic styles. Wrap them directly in <ul> instead of a <div> like before
          <ul
            ref={contentItemRef}
            className={classes.content(classNames.content)}
          >
            {items[currentOption].map((item, i) => (
              <li
                className={classes.contentItem(classNames.contentItem)}
                key={i}
              >
                {item}
              </li>
            ))}
          </ul>
        )
      }
      {switchTitlesAudioJSX}
    </div>
  )
}

SelectionMenuScreen.propTypes = {
  items: PropTypes.object.isRequired,
  playSFXs: PropTypes.bool,
  customTitles: PropTypes.object,
  ulContentAreLiTags: PropTypes.bool,
  animation: PropTypes.string,
  onMenuItemClick: PropTypes.func,
  forceSelectDefault: PropTypes.any,
  defaultTitle: PropTypes.string,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    menu: PropTypes.arrayOf(PropTypes.string),
    menuItem: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.arrayOf(PropTypes.string),
    contentItem: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(SelectionMenuScreen)
