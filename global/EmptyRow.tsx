import React from "react"
import { TableCell, TableRow } from "carbon-components-react"
import { CheckmarkFilled16 } from "@carbon/icons-react"

interface EmptyRowProps {
  // Since this row needs to span the full-width of the table,
  // it needs to know the # of cols
  // If using batch-enabled tables, may need to add 1 :)
  width: number
  text?: string
  subtext?: string

  textAlignment?: string
}

const EmptyRow: React.FC<EmptyRowProps> = ({
  width,
  text = "All done.",
  subtext,

  textAlignment = "center",
}: EmptyRowProps) => {
  return (
    <TableRow key={-1}>
      <TableCell style={{ textAlign: textAlignment }} colSpan={width} key={-1}>
        <CheckmarkFilled16
          style={{ position: "relative", top: "2px", marginRight: "5px" }}
          fill="#7bff6f"
        />{" "}
        {text} {subtext && <span style={{ opacity: 0.5 }}>{subtext}</span>}
      </TableCell>
    </TableRow>
  )
}

export default EmptyRow
