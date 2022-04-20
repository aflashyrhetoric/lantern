import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import moment from "moment"
import Link from "next/link"
import {
  Button,
  ButtonSet,
  Modal,
  Loading,
  Form,
  FormGroup,
  TextInput,
  DatePicker,
  DatePickerInput,
} from "carbon-components-react"
import { Launch20 } from "@carbon/icons-react"

import Page from "../../global/Page"
import LTable from "../../global/LTable"
import { AuthType, EditingState, LoginForm, Person } from "../../types"
import getHandlers from "../../helpers/form/eventHandlers"
import Validations from "../../helpers/form/validation"
import { endpoint } from "../../helpers/api"
import { getBaseURL } from "../../constants"
import { keys } from "@material-ui/core/styles/createBreakpoints"
import {
  createPerson,
  deletePerson,
  deletePersonRequest,
  updatePerson,
} from "../api/person"

const styles = require("./styles.module.scss")

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
  const [loginForm, setLoginForm] = useState<LoginForm>({} as LoginForm)
  const [loggedIn, setLoggedIn] = useState(false)
  const [invalidLogin, setInvalidLogin] = useState(false)

  // UI hooks
  const [personModalIsOpen, setPersonModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form hooks
  const [formState, setFormState] = useState<Person>(null)
  const [invalidFields, setInvalidFields] = useState([])
  const [editingMode, setEditingMode] = useState<EditingState>(
    EditingState.CREATE,
  )

  const filteredPeople = people.filter(person => {
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
      .then(data => {
        setPeople(data.data)
        setLoading(false)
      })
  }

  const login = () => {
    setLoading(true)
    setInvalidLogin(false)
    fetch(endpoint(baseurl, "/auth/login"), {
      method: "POST",
      body: JSON.stringify(loginForm),
      credentials: "include",
      mode: "cors",
    })
      .then((r: any) => {
        if (!r.ok) {
          setInvalidLogin(true)
          throw new Error("Invalid username or password")
        }
        return r
      })
      .then((r: any) => r.json())
      .then((r: any) => {
        Cookies.set("logged_in", true)

        window.location.reload()
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const signup = () => {
    setLoading(true)
    fetch(endpoint(baseurl, "/auth/signup"), {
      method: "POST",
      body: JSON.stringify(loginForm),
      mode: "cors",
    }).then(r => {
      setLoading(false)
      setAuthType(AuthType.Login)
    })
  }

  const logout = () => {
    fetch(endpoint(baseurl, "/auth/logout"), {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then(r => {
      window.location.replace("/appledore")
    })
  }

  // Initial load
  useEffect(() => {
    initialize()
  }, [])

  // const createPerson = () => {
  //   fetch(endpoint(baseurl, "/people"), {
  //     method: "POST",
  //     body: JSON.stringify(formState) as any,
  //     credentials: "include",
  //     mode: "cors",
  //   }).then(() => resetForm())
  // }

  // const updatePerson = (id: number) => {
  //   fetch(endpoint(baseurl, `/people/${id}`), {
  //     method: "PUT",
  //     body: JSON.stringify({
  //       ...formState,
  //       dob:
  //         formState.dob === null
  //           ? null
  //           : moment.utc(formState.dob).format("YYYY-MM-DD"),
  //     }) as any,
  //     credentials: "include",
  //     mode: "cors",
  //   }).then(() => resetForm())
  // }

  // const deletePerson = (person_id: number) => {
  //   deletePersonRequest(person_id).then(() => resetForm())
  // }

  // const deletePersonRequest = person_id => {
  //   return fetch(endpoint(baseurl, `/people/${person_id}`), {
  //     method: "DELETE",
  //     credentials: "include",
  //     mode: "cors",
  //   })
  // }

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

  // const sortedPeople = people.sort((a, b) => {
  //   if (people.length < 2) {
  //     return 0
  //   }

  //   if (a.last_name < b.last_name) {
  //     return -1
  //   }
  //   if (a.last_name > b.last_name) {
  //     return 1
  //   }
  //   if (a.last_name.split()[0] === b.last_name.split()[0]) {
  //     return 0
  //   }
  // })

  return (
    <Page logout={logout} loggedIn={loggedIn}>
      <>
        <Modal
          open={showLogin}
          modalHeading={`Lantern: ${authType}`}
          primaryButtonText={authType}
          secondaryButtonText="Cancel"
          onBlur={() => setShowLogin(false)}
          onRequestClose={() => setShowLogin(false)}
          onRequestSubmit={() => {
            if (authType === AuthType.Login) {
              login()
              return
            }
            if (authType === AuthType.Signup) {
              signup()
              return
            }
            return
          }}
        >
          <Form className="some-class" onSubmit={() => {}}>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={(loginForm && loginForm.email) || ""}
              invalid={invalidLogin}
              invalidText="The username or password was not successful - try again."
              labelText="Email"
              onChange={e =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value,
                })
              }
            />
            <div style={{ marginBottom: "20px" }} />
            <TextInput
              id="password"
              name="password"
              type="password"
              value={(loginForm && loginForm.password) || ""}
              invalid={invalidFields.includes("password")}
              invalidText="A valid value is required"
              labelText="Password"
              onChange={e =>
                setLoginForm({
                  ...loginForm,
                  password: e.target.value,
                })
              }
              onKeyUp={e => {
                if (e.key === "Enter") {
                  if (authType === AuthType.Login) {
                    login()
                    return
                  }
                  if (authType === AuthType.Signup) {
                    signup()
                    return
                  }
                }
              }}
            />
            <div style={{ marginBottom: "10px" }} />
            {
              <a
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setAuthType(
                    authType === AuthType.Login
                      ? AuthType.Signup
                      : AuthType.Login,
                  )
                }
              >
                Switch to {authType === AuthType.Login ? "Signup" : "Login"}
              </a>
            }
          </Form>
        </Modal>
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
            </FormGroup>
          </Form>
        </Modal>

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

        <TextInput
          labelText="Filter..."
          onChange={e => {
            setQuery(e.target.value)
          }}
        />

        <div style={{ marginBottom: "30px" }} />

        {loggedIn && (
          <LTable
            title="Contacts"
            openModal={() => setPersonModalOpen(true)}
            openDeleteModal={() => setDeleteModalOpen(true)}
            updateFormState={data => setFormState(data)}
            updateEditingMode={setEditingMode}
            onBatchDelete={(selectedRawRowsData: any[]) => {
              setLoading(true)

              const promises = selectedRawRowsData.map(data =>
                deletePersonRequest(baseurl, data),
              )

              Promise.all(promises).then(() => {
                setLoading(false)

                window.location.reload()
              })
            }}
            rawRowData={filteredPeople || []}
            rowData={
              people
                ? filteredPeople.map(p => ({
                    ...p,
                    id: `${p.id}`,
                    dob:
                      p.dob !== null
                        ? moment.utc(p.dob).format("YYYY-MM-DD")
                        : "-",
                    link: (
                      <span style={{ cursor: "pointer" }}>
                        <Link
                          href={`/appledore/${encodeURIComponent(p.id)}`}
                          passHref
                        >
                          <a href="">
                            <Launch20 className={styles.icon} />
                          </a>
                        </Link>
                      </span>
                    ),
                  }))
                : []
            }
            headerData={[
              {
                header: "ID",
                key: "id",
              },
              {
                header: "",
                key: "link",
              },
              {
                header: "Last",
                key: "last_name",
              },
              {
                header: "First",
                key: "first_name",
              },
              {
                header: "Career",
                key: "career",
              },
              {
                header: "Mobile",
                key: "mobile",
              },
              {
                header: "Email",
                key: "email",
              },
              {
                header: "Address",
                key: "address",
              },
              {
                header: "DOB",
                key: "dob",
              },
            ]}
            disableBatchEdit
          />
        )}
      </>
    </Page>
  )
}

export default Appledore
