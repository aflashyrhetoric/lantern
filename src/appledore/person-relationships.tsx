import React, { useState } from "react"
import { startCase } from "lodash"
import Link from "next/link"
import { ButtonSet, Button, Select, SelectItem } from "carbon-components-react"
import { FaceAdd32 } from "@carbon/icons-react"

import { Person } from "@/types/person"

import { Relationship, RelationshipType } from "@/types/relationship"
import { createRelationship } from "@/pages/api/relationship"

import styles from "@/pages/appledore/styles.module.scss"
import { enumToSelectItemsWithValuesAsKeys } from "@/helpers/form/carbon-helpers"
import { getName } from "@/helpers/person"
import PersonRelationshipsTable from "./person-relationships-table"

interface Props {
  baseurl: string
  person: Person
  people: Person[]
  loadData: Function
}

const PersonRelationships: React.FC<Props> = ({
  baseurl,
  person,
  people,
  loadData,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [relationship, setRelationship] = useState<RelationshipType>(null)
  const [relationshipToPersonID, setRelationshipToPersonID] =
    useState<number>(null)

  const resetForm = () => {
    setIsEditing(false)
    setRelationship(null)
    setRelationshipToPersonID(null)
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <h2>Relationships</h2>
        &nbsp;
        &nbsp;
        <Button
          kind="tertiary"
          renderIcon={FaceAdd32}
          iconDescription="Enables editing of relationships."
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
        />
      </div>

      {!isEditing && (
        <>
          {person?.relationships?.length === 0 && (
            <p>No relationships. Aw :C</p>
          )}
          {person?.relationships?.length > 0 && (
            <PersonRelationshipsTable
              baseurl={baseurl}
              relationships={person?.relationships}
              loadData={loadData}
            />
          )}
        </>
      )}

      <div style={{ marginBottom: "10px" }} />

      {isEditing && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "50vw",
            }}
          >
            <h3>{getName(person)} is the</h3>
            <div style={{ width: "200px" }}>
              <Select
                id="relationship-to-user"
                labelText=""
                value={relationship || ""}
                onChange={e => {
                  setRelationship(e.target.value)
                }}
                style={{ width: "100%" }}
              >
                <SelectItem value="" text="Select a field..." />
                {enumToSelectItemsWithValuesAsKeys(RelationshipType)}
              </Select>
            </div>

            <h3>of</h3>
            <div style={{ width: "200px" }}>
              <Select
                id="intermediate-person"
                labelText=""
                value={relationshipToPersonID || ""}
                onChange={e => {
                  setRelationshipToPersonID(Number(e.target.value))
                }}
                style={{ width: "100%" }}
              >
                <SelectItem value="" text="Select a field..." />
                {people?.map(person => (
                  <SelectItem value={person.id} text={getName(person)} />
                ))}
              </Select>
            </div>
          </div>
          <div style={{ marginBottom: "10px" }} />
          <ButtonSet>
            <Button kind="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              kind="primary"
              onClick={async () => {
                const payload: Omit<Relationship, "id"> = {
                  person_one_id: person.id,
                  person_two_id: relationshipToPersonID,
                  relationship_type: relationship,
                }
                await createRelationship(baseurl, payload)
                loadData()
                resetForm()
              }}
              disabled={!relationship || !relationshipToPersonID}
            >
              Save
            </Button>
          </ButtonSet>
        </>
      )}
    </>
  )
}

export default PersonRelationships
