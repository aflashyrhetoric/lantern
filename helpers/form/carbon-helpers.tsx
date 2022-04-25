import React from "react"
import { startCase } from "lodash"
import moment from "moment"
import { SelectItem } from "carbon-components-react"

// carbon-helpers.ts
// These helpers aim to normalize some of Carbon's quirks and speed up common operations
// NOTE: A more sophisticated set of event handling helpers exists at ./eventHandlers.ts which will also handle updating invalidFields arrays, etc.

const validCarbonInputComponents = [
  "DatePicker",
  "DatePickerInput",
  "Button",
  "Checkbox",
  "ComboBox",
  "",
]

/**
 * Gets the `value` from the emitted event. Prevents the need to memorize the shape of the events
 * @constructor
 * @param {event} object - The event emitted from the Carbon component's handler
 * @param {string} string - The name of the Carbon component, e.g. `SelectItem`
 */
export const getEventValue = (event: any, type: string) => {
  if (!validCarbonInputComponents.includes(type)) {
    throw new Error(
      "Not a valid Carbon Input Component. (Did you use the correct casing?)",
    )
  }

  switch (type) {
    case "DatePicker":
      return event[0]
    case "DatePickerInput":
      throw new Error(
        "The event handler (e.g. onChange) should be on the DatePicker, not the DatePickerInput",
      )
    default:
      return event.target.value
  }
}

interface SimpleEvent {
  target: {
    name: string
    value: any
  }
}

/**
 * Returns an `event` object in the usual form
 * @constructor
 * @param {name} string - The name of the input, e.g. `first_name`
 * @param {value} any - The value of the event
 */
export const makeEvent = (name: string, value: any): SimpleEvent => ({
  target: {
    name,
    value,
  },
})

/**
 * Handles DatePicker-emitted events
 */

const defaultFormat = "YYYY-MM-DD"
export const makeDatePickerEvent = (
  name: string,
  event: any,
  format = defaultFormat,
  nullable = false, // Some dates can be null, such as the "end_date' for a borrower's current job
): SimpleEvent | Error => {
  if (event[0] === null && !nullable) {
    return new Error("entered date was invalid")
  }

  const v = event[0] === null ? null : moment(event[0]).format(format)

  return {
    target: {
      name,
      value: v,
    },
  }
}

/**
 * Handles Checkbox-emitted events
 */
export const makeCheckboxEvent = (
  name: string,
  event: any,
  format = defaultFormat,
  nullable = false, // Some dates can be null, such as the "end_date' for a borrower's current job
): SimpleEvent | Error => {
  if (event[0] === null && !nullable) {
    return new Error("entered date was invalid")
  }

  const v = event[0] === null ? null : moment(event[0]).format(format)

  return {
    target: {
      name,
      value: v,
    },
  }
}

/*
  When handling boolean values, sometimes truthy/falsy evaluation can lead to really hard-to-track bugs.

  Use these helpers to abstract away the task of handling and displaying boolean values (eg: event.target.value)
*/

// Converts stringified bools into bools, while allowing for `null` values
// "true" -> true
export const normalizeBoolEvent = (value: string): boolean => {
  if (value === "null") {
    return null
  }

  return value === "true"
}

// Converts bools into stringified bools
// This is useful in <Select>s, for example
// Will display `true` as "true" and `false` as "false" and null as "null"
export const displayBoolValue = (value: boolean | string): string => {
  // if (value === null) return "null";
  if (value === null || value === "null") {
    return "null"
  }
  // if (value === null) return "null";
  if (value === true || value === "true") {
    return "true"
  }
  if (value === false || value === "false") {
    return "false"
  }
  throw new Error(`Invalid boolean value of ${value}`)
}

// Returns strings as-is, except `null` values are returned as `""` (empty string). Useful for
// Carbon inputs where values may be null, but the Carbon component expects an empty string.
//
// Note that this does not affect how the final values will be parsed/validated by Formik/Yup. If
// a field with one of these empty string values is marked as nullable, for example, that will still
// be parsed correctly and then synced to the data model as `null` (vs. the `""` we emitted here).
export const nullableStringAsEmpty = (value: string | null): string => {
  if (value === null) {
    return ""
  }
  return value
}

const optionToSelectItem = ({ label, value }: SelectItemType) => (
  <SelectItem key={`select-opt-${value}`} text={label} value={value} />
)

/**
 * enumToSelectItems
 * @param e any Typescript Enum (not Enum.Something, but Enum itself directly)
 * @returns an array of Carbon's SelectItems with the enum property name as the label
 */
export const enumToSelectItems = (e): JSX.Element[] => {
  const options = []

  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(e)) {
    options.push({
      label: startCase(k),
      value: v,
    })
  }

  return options.map(optionToSelectItem)
}

/**
 * enumToSelectItemsWithDisplayTextMap
 * @param e any Typescript Enum (not Enum.Something, but Enum itself directly)
 * @param enumToDisplayTextMap an obj mapping the enum key to some string
 * @returns an array of Carbon's SelectItems with the corresponding value from the display map as the label
 */
export const enumToSelectItemsWithDisplayTextMap = (
  e,
  enumToDisplayTextMap: object,
): JSX.Element[] => {
  if (!enumToDisplayTextMap) {
    throw new Error("enumToDisplayTextMap is required")
  }

  const options = []

  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(e)) {
    options.push({
      // If there's a map for displaying pretty printed text, use it. Otherwise, startCase() it for decent results
      label: enumToDisplayTextMap[v as any],
      value: v,
    })
  }

  return options.map(optionToSelectItem)
}

/**
 * enumToSelectItemsWithValuesAsKeys
 * @param e any Typescript Enum (not Enum.Something, but Enum itself directly)
 * @returns an array of Carbon's SelectItems with the enum property value as the label
 */
export const enumToSelectItemsWithValuesAsKeys = (e): JSX.Element[] => {
  const options = []

  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(e)) {
    options.push({
      label: startCase(v),
      value: v,
    })
  }

  return options.map(optionToSelectItem)
}

/**
 * enumToSelectItemsWithHumanizedLabelAsKeyValue
 * @param e any Typescript Enum (not Enum.Something, but Enum itself directly)
 * @returns an array of Carbon's SelectItems with the enum property value as the label
 */
export const enumToSelectItemsWithHumanizedLabelAsKeyValue = (
  e,
): JSX.Element[] => {
  const options = []

  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(e)) {
    options.push({
      label: startCase(k),
      value: startCase(k),
    })
  }

  return options.map(optionToSelectItem)
}

/** getBooleanSelectItems generates a straight-forward set of boolean SelectItems
 * Consider using `normalizeBoolEvent` before handling the event and `displayBoolValue` to display the boolean value
 * @returns an array of Carbon's SelectItems with "true" and "false" as options
 */
const getBooleanSelectItems = (useYesAndNo: boolean = false): JSX.Element[] => {
  return [
    { label: useYesAndNo ? "Yes" : "True", value: "true" },
    { label: useYesAndNo ? "No" : "False", value: "false" },
  ].map(optionToSelectItem)
}
export const booleanSelectItems = getBooleanSelectItems(true)
