import React, { memo, useCallback } from "react"
import PropTypes from "prop-types"
import Input from "../Input/Input"
import { classes } from "./InputWithSubmit.utils"

function InputWithSubmit({
  onSubmit, // <fuction> <form>'s submission callback
  preventDefault, // <boolean> on true, default <form> event is prevented
  classNames = {}, // <object> classNames object. Check propTypes below for its constitution
  ...otherProps // <object> all other props passed to <Input />
}) {
  const handleSubmit = useCallback(
    // prevent default if assigned in props and trigger onSubit callback
    (e) => {
      preventDefault && e.preventDefault()
      onSubmit(e)
    },
    [preventDefault, onSubmit]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={classes.container(classNames.container)}
    >
      <Input classNames={classes.input(classNames.input)} {...otherProps} />
    </form>
  )
}

InputWithSubmit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  preventDefault: PropTypes.bool,
  classNames: PropTypes.shape({
    container: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.arrayOf(PropTypes.string)
  })
}

export default memo(InputWithSubmit)
