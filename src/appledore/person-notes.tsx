import React from "react"
import { TextArea, ButtonSet, Button } from "carbon-components-react"
import { TrashCan20 } from "@carbon/icons-react"

import { Person } from "@/types/person"

import styles from "@/pages/appledore/styles.module.scss"

interface Props {
  person: Person

  noteForm: string
  setNoteForm: Function

  addNote: () => void
  deleteNote: (id: number) => void
}

const PersonNotes: React.FC<Props> = ({
  person,
  noteForm,
  setNoteForm,
  addNote,
  deleteNote,
}: Props) => {
  return (
    <>
      <h2>Notes</h2>
      <TextArea
        labelText="Enter new note"
        value={noteForm}
        onChange={e => setNoteForm(e.target.value)}
      />

      {noteForm.length > 0 && (
        <ButtonSet>
          <Button kind="secondary" onClick={e => setNoteForm("")}>
            Cancel
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              addNote()
            }}
          >
            Save
          </Button>
        </ButtonSet>
      )}

      <div style={{ marginBottom: "20px" }} />
      {!person.notes || (person.notes.length == 0 && <p>No notes.</p>)}
      {person.notes && person.notes.length > 0 && (
        <div className={styles.recordsList}>
          {person.notes.map(n => (
            <div>
              {n.text}{" "}
              <span>
                <TrashCan20
                  className={styles.iconRed}
                  onClick={() => {
                    deleteNote(n.id)
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

export default PersonNotes
