import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import moment from "moment"
import {
  Button,
  ButtonSet,
  Checkbox,
  DatePicker,
  DatePickerInput,
  Form,
  FormGroup,
  Loading,
  Modal,
  Select,
  SelectItem,
  TextInput,
} from "carbon-components-react"

import Page from "../../global/Page"
import { AuthType, EditingState, Person } from "../../types"
import getHandlers from "../../helpers/form/eventHandlers"
import Validations from "../../helpers/form/validation"
import { endpoint } from "../../helpers/api"
import { getBaseURL } from "../../constants"
import { createPerson, deletePerson, updatePerson } from "../api/person"
import ContactsTable from "../../src/appledore/contacts-table"
import LoginModal from "../../src/appledore/login-modal"
import { logout } from "../../src/appledore/auth"
import { RelationshipType } from "../../types/relationship"
import { enumToSelectItemsWithValuesAsKeys } from "../../helpers/form/carbon-helpers"
import { getName } from "../../helpers/person"

export async function getStaticProps() {
  return {
    props: {
      baseurl: getBaseURL(process.env.LANTERN_ENV),
    },
  }
}

const Appledore: React.FC = (props: any) => {
  const { baseurl } = props
  const [people, setPeople] = useState<Person[]>([])
  const [query, setQuery] = useState("")

  const [authType, setAuthType] = useState<AuthType>(AuthType.Login)
  const [showLogin, setShowLogin] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  // UI hooks
  const [personModalIsOpen, setPersonModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form hooks
  const [formState, setFormState] = useState<Person>(null)
  const [knowsPersonThroughSomeoneElse, setKnowsPersonThroughSomeoneElse] =
    useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [editingMode, setEditingMode] = useState<EditingState>(
    EditingState.CREATE,
  )

  const filteredPeople = people?.filter(person => {
    if (query === "") {
      return true
    }
    if (people.length === 0) return []

    const { first_name, last_name, career, email } = person
    return [first_name, last_name, career, email]
      .map(p => (p ? p.toLowerCase().trim() : p))
      .join()
      .includes(query.toLowerCase().trim())
  })

  const initialize = () => {
    const t = Cookies.get("logged_in")
    if (t === undefined || t === "") {
      setShowLogin(true)
    } else {
      setLoggedIn(true)
      loadData()
    }
  }

  const loadData = () => {
    setLoading(true)
    fetch(endpoint(baseurl, "/people"), {
      credentials: "include",
      mode: "cors",
    })
      .then(response => response.json())
      .then(response => {
        setPeople(response.data)
        setLoading(false)
      })
  }

  // Initial load
  useEffect(() => {
    initialize()
  }, [])

  const resetForm = () => {
    setDeleteModalOpen(false)
    setPersonModalOpen(false)
    setLoading(true)
    setFormState(null)
    loadData()
  }

  const { handleTextInputChange, handlePhoneNumberInputChange } = getHandlers(
    formState,
    setFormState,
    invalidFields,
    setInvalidFields,
  )

  if (!loggedIn) {
    return (
      <Page
        logout={() =>
          logout(baseurl).then(r => {
            window.location.replace("/appledore")
          })
        }
        loggedIn={loggedIn}
      >
        {!loggedIn && !showLogin && (
          <ButtonSet>
            <Button
              kind="secondary"
              onClick={() => {
                setAuthType(AuthType.Signup)
                setShowLogin(true)
              }}
            >
              Sign up
            </Button>
            <Button
              kind="primary"
              onClick={() => {
                setAuthType(AuthType.Login)
                setShowLogin(true)
              }}
            >
              Login
            </Button>
          </ButtonSet>
        )}
        <LoginModal
          baseurl={baseurl}
          showLogin={showLogin}
          authType={authType}
          setAuthType={setAuthType}
          setShowLogin={setShowLogin}
        />
      </Page>
    )
  }

  return (
    <Page
      logout={() =>
        logout(baseurl).then(r => {
          window.location.replace("/appledore")
        })
      }
      loggedIn={loggedIn}
    >
      <>
        <Modal
          danger
          open={deleteModalOpen}
          modalHeading="Confirm deletion of person and all associated data?"
          primaryButtonText="Delete"
          secondaryButtonText="No"
          onBlur={() => setDeleteModalOpen(false)}
          onRequestClose={() => setDeleteModalOpen(false)}
          onRequestSubmit={() => deletePerson(baseurl, formState.id, resetForm)}
        />

        <Modal
          open={personModalIsOpen}
          modalHeading={
            editingMode === EditingState.CREATE
              ? "Add contact"
              : "Update contact"
          }
          primaryButtonText={
            editingMode === EditingState.CREATE ? "Save" : "Update"
          }
          secondaryButtonText="Cancel"
          selectorPrimaryFocus="#first-name"
          onRequestSubmit={() => {
            setLoading(true)
            if (editingMode === EditingState.CREATE) {
              createPerson(baseurl, formState, resetForm)
            }
            if (editingMode === EditingState.UPDATE) {
              updatePerson(baseurl, formState, formState.id, resetForm)
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
                  handleTextInputChange(e, "first_name", [
                    Validations.IsRequired,
                  ])
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

              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  <Select
                    id="relationship-to-user"
                    labelText="What is this person's relationship to you?"
                    value={formState?.relationship_to_user || ""}
                    onChange={e => {
                      setFormState({
                        ...formState,
                        relationship_to_user: e.target.value,
                      })
                    }}
                    style={{ width: "100%" }}
                  >
                    <SelectItem value="" text="Select a field..." />
                    {enumToSelectItemsWithValuesAsKeys(RelationshipType)}
                  </Select>
                </div>
                <div style={{ width: "50%" }}></div>
              </div>
              <div style={{ marginBottom: "20px" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Checkbox
                    id="knows-through-someone-else"
                    labelText="I met this person through someone else."
                    checked={knowsPersonThroughSomeoneElse}
                    onChange={() => {
                      setKnowsPersonThroughSomeoneElse(
                        !knowsPersonThroughSomeoneElse,
                      )
                    }}
                  />
                </div>
                <div style={{ width: "48%" }}>
                  {knowsPersonThroughSomeoneElse && (
                    <Select
                      id="intermediate-person"
                      labelText="Who introduced you to this person?"
                      value={
                        formState?.relationship_to_user_through_person_id || ""
                      }
                      onChange={e => {
                        setFormState({
                          ...formState,
                          relationship_to_user_through_person_id: Number(
                            e.target.value,
                          ),
                        })
                      }}
                      style={{ width: "100%" }}
                    >
                      <SelectItem value="" text="Select a field..." />
                      {people?.map(person => (
                        <SelectItem value={person.id} text={getName(person)} />
                      ))}
                    </Select>
                  )}
                </div>
              </div>
            </FormGroup>
          </Form>
        </Modal>

        <TextInput
          labelText="Filter contacts..."
          onChange={e => {
            setQuery(e.target.value)
          }}
          style={{ marginBottom: "30px" }}
        />

        <ContactsTable
          baseurl={baseurl}
          openModal={setPersonModalOpen}
          openDeleteModal={setDeleteModalOpen}
          setFormState={setFormState}
          setLoading={setLoading}
          setEditingMode={setEditingMode}
          people={people ? filteredPeople : []}
        />
      </>
    </Page>
  )
}

export default Appledore
