/* LTableHeader.tsx
 * This is an alternative to DataTable's "title" prop
 *   that uses less white-space
 *   It will not collide with the <BatchActions> menu.
 * When using directly (and not as part of BaseTable), the parent
 *   <div> MUST have `position: relative;` for correct styling.
 */
import React from "react"

interface Props {
  title: string
}

export const LTableHeader: React.FC<Props> = ({ title }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          zIndex: 1,
          top: "14px",
          left: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            marginRight: "5px",
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  )
}
export default LTableHeader
