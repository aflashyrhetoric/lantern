import { TableCell } from "carbon-components-react"

export const prepareTableCell = ({ value, id }, style = {}) => {
  // If null or undefined, print sentinel value of "-"
  // (CAUTION: 'typeof null' is equal to 'object' in JS, keep this if statement FIRST to ensure columns work properly)
  if (value === null || value === undefined)
    return <TableCell key={id}>-</TableCell>

  // If we're passing in a TableCell directly, just render it raw
  if (typeof value === "object" && value.type.displayName === "TableCell") {
    return value
  }

  // Otherwise, print the cell value as normal
  return (
    <TableCell title={value} key={id} style={style}>
      {value}
    </TableCell>
  )
}
