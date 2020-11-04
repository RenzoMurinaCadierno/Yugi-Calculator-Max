import React, { useCallback } from "react"
import PropTypes from "prop-types"
import InputWithLabel from "../../../components/UI/InputWithLabel/InputWithLabel"
import { classes } from "./CardFilter.utils"

export default function CardFilter({ value, setValue, disabled }) {
  // <InputWithLabel>'s onChange callback
  const handleChange = useCallback((e) => setValue(e.target.value), [setValue])

  return (
    <InputWithLabel
      id="cardFilter"
      type="text"
      value={value}
      labelText="Filter list"
      disabled={disabled}
      autoComplete="off"
      role="search"
      onChange={handleChange}
      classNames={classes.inputWithLabel}
    />
  )
}

CardFilter.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}
