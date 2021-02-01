import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"

import {
  ButtonSet,
  Button,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListBody,
  StructuredListCell,
  TextArea,
} from "carbon-components-react"
import { TrashCan20 } from "@carbon/icons-react"

import Page from "../../global/Page"
import { endpoint } from "../../helpers/api"
import { Person } from "../../types"
import { getBaseURL } from "../../constants"

const styles = require("./styles.module.scss")

export async function getServerSideProps() {
  return {
    props: {
      baseurl: getBaseURL(process.env.LANTERN_ENV),
    },
  }
}

const Dossier = props => {
  const { baseurl } = props
  const router = useRouter()
  const { person_id } = router.query

  const [person, setPerson] = useState<Person>(null)
  const [noteForm, setNoteForm] = useState("")
  const [pressurePointForm, setPressurePointForm] = useState("")

  const [loading, setLoading] = useState(false)

  const loadData = () =>
    fetch(endpoint(baseurl, `/people/${person_id}`))
      .then(response => response.json())
      .then(data => {
        setPerson(data.data)
        setLoading(false)
      })

  useEffect(() => {
    if (person_id) {
      loadData()
    }
  }, [person_id])

  const addNote = () => {
    setLoading(true)

    fetch(endpoint(baseurl, `/notes/${person_id}`), {
      method: "POST",
      body: JSON.stringify({ text: noteForm, person_id } as any),
    }).then(data => {
      setNoteForm("")
      loadData()
      setLoading(false)
    })
  }

  const deleteNote = (id: number) => {
    setLoading(true)

    fetch(endpoint(baseurl, `/notes/${id}`), {
      method: "DELETE",
    }).then(data => {
      loadData()
      setLoading(false)
    })
  }

  const addPressurePoint = () => {
    setLoading(true)

    fetch(endpoint(baseurl, `/pressure-points/${person_id}`), {
      method: "POST",
      body: JSON.stringify({
        description: pressurePointForm,
        person_id,
      } as any),
    }).then(data => {
      setPressurePointForm("")
      loadData()
      setLoading(false)
    })
  }

  const deletePressurePoint = (id: number) => {
    setLoading(true)

    fetch(endpoint(baseurl, `/pressure-points/${id}`), {
      method: "DELETE",
    }).then(data => {
      loadData()
      setLoading(false)
    })
  }

  return (
    <Page>
      {!person ||
        (person.first_name === "" && (
          <a href="/appledore">
            User could not load and may not exist - return to Appledore
          </a>
        ))}
      {person && person.first_name !== "" && (
        <div className={styles.pageInner}>
          <h1>
            {" "}
            {person.first_name} {person.last_name}{" "}
          </h1>
          <StructuredListWrapper ariaLabel="Structured list">
            <StructuredListHead>
              <StructuredListRow head tabIndex={0}>
                <StructuredListCell head>Career</StructuredListCell>
                <StructuredListCell head>Email</StructuredListCell>
                <StructuredListCell head>Mobile</StructuredListCell>
                <StructuredListCell head>Address</StructuredListCell>
                <StructuredListCell head>DOB</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>{person.career}</StructuredListCell>
                <StructuredListCell>{person.email}</StructuredListCell>
                <StructuredListCell>{person.mobile}</StructuredListCell>
                <StructuredListCell>{person.address}</StructuredListCell>
                <StructuredListCell>{person.dob}</StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>

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
          {!person.notes || (person.notes.length == 0 && <p>No notes</p>)}
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
          <br />
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
          <div style={{ marginBottom: "20px" }} />
          {!person.pressure_points ||
            (person.pressure_points.length == 0 && <p>No pressure_points</p>)}
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
        </div>
      )}
    </Page>
  )
}

export default Dossier
