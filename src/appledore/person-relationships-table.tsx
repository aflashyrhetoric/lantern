import React from "react"
import Link from "next/link"
import { TrashCan20 } from "@carbon/icons-react"
import {
  Button,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListWrapper,
} from "carbon-components-react"

import { getName } from "@/helpers/person"
import { RelationshipHydrated } from "@/types/relationship"
import { deleteRelationship } from "@/pages/api/relationship"

interface Props {
  baseurl: string
  relationships: RelationshipHydrated[]
  loadData: Function
}

const PersonRelationshipsTable: React.FC<Props> = ({
  baseurl,
  relationships,
  loadData,
}: Props) => {
  return (
    <StructuredListWrapper ariaLabel="Structured list">
      <StructuredListHead>
        <StructuredListRow head tabIndex={0}>
          <StructuredListCell head>Person</StructuredListCell>
          <StructuredListCell head>Relationship</StructuredListCell>
          <StructuredListCell head></StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {relationships?.map(r => {
          return (
            <StructuredListRow
              tabIndex={0}
              key={`${r.person_id}-${r.relationship_type}`}
            >
              <StructuredListCell>
                <Link
                  href={`/appledore/${encodeURIComponent(r.person_id)}`}
                  passHref
                >
                  <a href="" style={{ fontSize: "20px" }}>
                    {getName(r.person)}
                  </a>
                </Link>
              </StructuredListCell>
              <StructuredListCell>
                <p style={{ fontSize: "20px" }}>{r.relationship_type} </p>
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  kind="danger--tertiary"
                  danger
                  onClick={async () => {
                    await deleteRelationship(baseurl, r.id)
                    loadData()
                  }}
                  renderIcon={TrashCan20}
                  iconDescription="Edit relationship"
                />
              </StructuredListCell>
            </StructuredListRow>
          )
        })}
      </StructuredListBody>
    </StructuredListWrapper>
  )
}

export default PersonRelationshipsTable
