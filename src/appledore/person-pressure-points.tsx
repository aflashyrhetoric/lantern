import React from "react"
import { TextArea, ButtonSet, Button } from "carbon-components-react"
import { TrashCan20 } from "@carbon/icons-react"

import { Person } from "@/types/person"

import styles from "@/pages/appledore/styles.module.scss"

interface Props {
  person: Person

  pressurePointForm: string
  setPressurePointForm: Function

  addPressurePoint: () => void
  deletePressurePoint: (id: number) => void
}

const PersonPressurePoints: React.FC<Props> = ({
  person,
  pressurePointForm,
  setPressurePointForm,
  addPressurePoint,
  deletePressurePoint,
}: Props) => {
  return (
    <>
      <h2>Pressure Points</h2>
      <TextArea
        labelText="Enter pressure point"
        value={pressurePointForm}
        onChange={e => setPressurePointForm(e.target.value)}
      />
      {pressurePointForm.length > 0 && (
        <ButtonSet>
          <Button kind="secondary" onClick={e => setPressurePointForm("")}>
            Cancel
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              addPressurePoint()
            }}
          >
            Save
          </Button>
        </ButtonSet>
      )}
      <div style={{ marginBottom: "50px" }} />
      {!person.pressure_points ||
        (person.pressure_points.length == 0 && (
          <p>No pressure points. Waow.</p>
        ))}
      {person.pressure_points && person.pressure_points.length > 0 && (
        <div className={styles.recordsList}>
          {person.pressure_points.map(n => (
            <div>
              {n.description}{" "}
              <span>
                <TrashCan20
                  className={styles.iconRed}
                  onClick={() => {
                    deletePressurePoint(n.id)
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default PersonPressurePoints
