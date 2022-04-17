import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

import {
  ButtonSet,
  Button,
  DatePicker,
  DatePickerInput,
  Modal,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListBody,
  StructuredListCell,
  TextArea,
  TextInput,
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

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [person, setPerson] = useState<Person>(null)
  const [formState, setFormState] = useState(person || {})
  const [noteForm, setNoteForm] = useState("")
  const [pressurePointForm, setPressurePointForm] = useState("")

  const [loading, setLoading] = useState(false)

  const loadData = () =>
    fetch(endpoint(baseurl, `/people/${person_id}`), {
      credentials: "include",
      mode: "cors",
    })
      .then(response => {
        console.log(response)
        if (response.status !== 403) {
          return response.json()
        } else {
          window.location.replace("/appledore")
        }
      })
      .then(data => {
        setPerson(data.data)
        setLoading(false)
      })
      .catch(() => {
        window.location.replace("/appledore")
      })

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
        (person?.first_name === "" && (
          <a href="/appledore">
            User could not load and may not exist - return to Appledore
          </a>
        ))}
      {person?.first_name && (
        <div className={styles.pageInner}>
          <div style={{ display: "inline-flex" }}>
            <h1>
              {" "}
              {person.first_name} {person.last_name}{" "}
            </h1>
            <Button size="sm" kind="secondary">
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
      <Modal
        open={personModalIsOpen}
        modalHeading={
          editingMode === EditingState.CREATE ? "Add contact" : "Update contact"
        }
        primaryButtonText={
          editingMode === EditingState.CREATE ? "Save" : "Update"
        }
        secondaryButtonText="Cancel"
        selectorPrimaryFocus="#first-name"
        onRequestSubmit={() => {
          setLoading(true)
          if (editingMode === EditingState.CREATE) {
            createPerson()
          }
          if (editingMode === EditingState.UPDATE) {
            updatePerson(formState.id)
          }
        }}
        onRequestClose={() => {
          resetForm()
          setPersonModalOpen(false)
        }}
        onBlur={() => {
          resetForm()
          setPersonModalOpen(false)
        }}
      >
        {/* Loading spinner for table */}
        <Loading active={loading} />

        <Form className="some-class" onSubmit={() => {}}>
          <FormGroup legendText="Basic Information">
            <TextInput
              id="first-name"
              name="first_name"
              value={(formState && formState.first_name) || ""}
              placeholder="Thomas"
              invalid={invalidFields.includes("first_name")}
              invalidText="A valid value is required"
              labelText="First name"
              onChange={e =>
                handleTextInputChange(e, "first_name", [Validations.IsRequired])
              }
            />
            <div style={{ marginBottom: "10px" }} />
            <TextInput
              id="last-name"
              name="last_name"
              value={(formState && formState.last_name) || ""}
              placeholder="Shelby"
              invalid={invalidFields.includes("last_name")}
              invalidText="A valid value is required"
              labelText="Last name"
              onChange={e => handleTextInputChange(e, "last_name", [])}
            />
            <div style={{ marginBottom: "10px" }} />
            <TextInput
              id="career"
              name="career"
              value={(formState && formState.career) || ""}
              placeholder="Engineer"
              invalid={invalidFields.includes("career")}
              invalidText="A valid value is required"
              labelText="Career"
              onChange={e => handleTextInputChange(e, "career", [])}
            />
            <div style={{ marginBottom: "10px" }} />
            <TextInput
              id="mobile"
              name="mobile"
              value={(formState && formState.mobile) || ""}
              placeholder="555-1242"
              invalid={invalidFields.includes("mobile")}
              invalidText="A valid value is required"
              labelText="Mobile"
              onChange={e => handlePhoneNumberInputChange(e, "mobile")}
            />
            <div style={{ marginBottom: "10px" }} />
            <TextInput
              id="email"
              name="email"
              value={(formState && formState.email) || ""}
              placeholder="Enter email"
              invalid={invalidFields.includes("email")}
              invalidText="A valid value is required"
              labelText="Email"
              onChange={e => handleTextInputChange(e, "email")}
            />
            <div style={{ marginBottom: "10px" }} />
            <TextInput
              id="address"
              name="address"
              value={(formState && formState.address) || ""}
              placeholder="Enter address"
              invalid={invalidFields.includes("address")}
              invalidText="A valid value is required"
              labelText="Address"
              onChange={e => handleTextInputChange(e, "address", [])}
            />
            <div style={{ marginBottom: "10px" }} />
            <DatePicker
              id="date-picker"
              datePickerType="single"
              dateFormat="Y-m-d"
              style={{ marginBottom: "10px" }}
              value={
                formState &&
                formState.dob &&
                moment.utc(formState.dob).format("YYYY-MM-DD")
              }
              onChange={event => {
                setFormState({
                  ...formState,
                  dob: moment(event[0]).format("YYYY-MM-DD"),
                })
              }}
            >
              <DatePickerInput
                id="date-picker-input-id"
                invalid={invalidFields.includes("dob")}
                iconDescription="Select a dob"
                labelText="DOB"
                placeholder="yyyy-mm-dd"
                type="text"
              />
            </DatePicker>
          </FormGroup>
        </Form>
      </Modal>
    </Page>
  )
}

export default Dossier
