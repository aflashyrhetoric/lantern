import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

import {
  Button,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListBody,
  StructuredListCell,
} from "carbon-components-react"

import Page from "@/global/Page"
import { EditingState, Person } from "@/types"

import { getBaseURL } from "@/constants"
import { PersonPageResponse } from "@/api/person"

import { endpoint } from "@/helpers/api"
import getHandlers from "@/helpers/form/eventHandlers"

import PersonFormModal from "@/lantern/appledore/person-form"
import PersonNotes from "@/lantern/appledore/person-notes"
import PersonPressurePoints from "@/lantern/appledore/person-pressure-points"
import PersonRelationships from "@/lantern/appledore/person-relationships"

const styles = require("./styles.module.scss")

export async function getStaticProps() {
  return {
    props: {
      baseurl: getBaseURL(process.env.LANTERN_ENV),
    },
  }
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  }
}

const Dossier = props => {
  const { baseurl } = props
  const router = useRouter()
  const { person_id } = router.query

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [person, setPerson] = useState<Person>(null)
  const [allPeople, setAllPeople] = useState<Person[]>([])
  const [formState, setFormState] = useState<Person>(person || ({} as Person))
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [noteForm, setNoteForm] = useState("")
  const [pressurePointForm, setPressurePointForm] = useState("")

  const [loading, setLoading] = useState(false)

  const { handleTextInputChange, handlePhoneNumberInputChange } = getHandlers(
    formState,
    setFormState,
    invalidFields,
    setInvalidFields,
  )

  const loadData = async () => {
    try {
      let response = await fetch(endpoint(baseurl, `/people/${person_id}`), {
        credentials: "include",
        mode: "cors",
      })

      if (response.status === 403) {
        window.location.replace("/appledore")
      }

      response = await response.json()

      const {
        data: { person, user_data },
      } = response as PersonPageResponse

      setPerson(person)
      setFormState(person)
      setAllPeople(user_data?.people?.filter(p => p.id !== person.id))

      setLoading(false)
    } catch (err) {
      window.location.replace("/appledore")
    }
  }

  useEffect(() => {
    const t = Cookies.get("logged_in")
    if (t === undefined || t === "") {
      window.location.replace("/appledore")
    } else {
      if (person_id) {
        loadData()
      }
    }
  }, [person_id])

  const addNote = async () => {
    setLoading(true)

    await fetch(endpoint(baseurl, `/notes/${person_id}`), {
      method: "POST",
      body: JSON.stringify({ text: noteForm, person_id } as any),
    })

    setNoteForm("")
    loadData()

    setLoading(false)
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

  const resetForm = () => {
    setModalIsOpen(false)
    setLoading(true)
    setFormState(null)
    loadData()
  }

  return (
    <Page>
      {!person ||
        (person?.first_name === "" && (
          <a href="/appledore">
            User could not load and may not exist - return to Appledore
          </a>
        ))}
      {person?.first_name && (
        <div className={styles.pageInner}>
          <div
            style={{ display: "inline-flex", justifyContent: "space-between" }}
          >
            <h1>
              {" "}
              {person.first_name} {person.last_name}{" "}
            </h1>
            <Button
              size="sm"
              kind="secondary"
              onClick={() => {
                setModalIsOpen(!modalIsOpen)
                setFormState(person || ({} as Person))
              }}
            >
              Edit
            </Button>
          </div>
          <StructuredListWrapper ariaLabel="Structured list">
            <StructuredListHead>
              <StructuredListRow head tabIndex={0}>
                {person.career && (
                  <StructuredListCell head>Career</StructuredListCell>
                )}
                {person.email && (
                  <StructuredListCell head>Email</StructuredListCell>
                )}
                {person.mobile && (
                  <StructuredListCell head>Mobile</StructuredListCell>
                )}
                {person.address && (
                  <StructuredListCell head>Address</StructuredListCell>
                )}
                {person.dob && (
                  <StructuredListCell head>DOB</StructuredListCell>
                )}
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow tabIndex={0}>
                {person.career && (
                  <StructuredListCell>{person.career}</StructuredListCell>
                )}
                {person.email && (
                  <StructuredListCell>{person.email}</StructuredListCell>
                )}
                {person.mobile && (
                  <StructuredListCell>{person.mobile}</StructuredListCell>
                )}
                {person.address && (
                  <StructuredListCell>{person.address}</StructuredListCell>
                )}
                {person.dob && (
                  <StructuredListCell>{person.dob}</StructuredListCell>
                )}
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "48%" }}>
              <PersonNotes
                person={person}
                noteForm={noteForm}
                setNoteForm={setNoteForm}
                addNote={addNote}
                deleteNote={deleteNote}
              />
            </div>
            <div style={{ width: "48%" }}>
              <PersonPressurePoints
                person={person}
                pressurePointForm={pressurePointForm}
                setPressurePointForm={setPressurePointForm}
                addPressurePoint={addPressurePoint}
                deletePressurePoint={deletePressurePoint}
              />
            </div>
          </div>
          <PersonRelationships
            baseurl={baseurl}
            person={person}
            people={allPeople}
            loadData={loadData}
          />
        </div>
      )}
      {person && (
        <PersonFormModal
          baseurl={baseurl}
          modalOpen={modalIsOpen}
          setModalOpen={setModalIsOpen}
          loading={loading}
          setLoading={setLoading}
          resetForm={resetForm}
          editingMode={EditingState.UPDATE}
          person={person}
          people={allPeople}
        />
      )}
    </Page>
  )
}

export default Dossier
