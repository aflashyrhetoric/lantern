import React, { useState, useEffect } from "react"
import moment from "moment"
import {
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
import { EditingState, Person } from "../../types"
import getHandlers from "../../helpers/form/eventHandlers"
import Validations from "../../helpers/form/validation"
import { endpoint } from "../../helpers/api"
import { getBaseURL } from "../../constants"

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
  const [people, setPeople] = useState([])

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

  const loadData = () =>
    fetch(endpoint(baseurl, "/people"))
      .then(response => response.json())
      .then(data => {
        setPeople(data.data)
        setLoading(false)
      })

  // Initial load
  useEffect(() => {
    loadData()
  }, [])

  const createPerson = () => {
    fetch(endpoint(baseurl, "/people"), {
      method: "POST",
      body: JSON.stringify(formState) as any,
    }).then(() => resetForm())
  }

  const updatePerson = (id: number) => {
    fetch(endpoint(baseurl, `/people/${id}`), {
      method: "PUT",
      body: JSON.stringify({
        ...formState,
        dob:
          formState.dob === null
            ? null
            : moment.utc(formState.dob).format("YYYY-MM-DD"),
      }) as any,
    }).then(() => resetForm())
  }

  const deletePerson = (person_id: number) => {
    deletePersonRequest(person_id).then(() => resetForm())
  }

  const deletePersonRequest = person_id => {
    return fetch(endpoint(baseurl, `/people/${person_id}`), {
      method: "DELETE",
    })
  }

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

  return (
    <Page>
      <>
        <Modal
          danger
          open={deleteModalOpen}
          modalHeading="Confirm deletion of person and all associated data?"
          primaryButtonText="Delete"
          secondaryButtonText="No"
          onBlur={() => setDeleteModalOpen(false)}
          onRequestClose={() => setDeleteModalOpen(false)}
          onRequestSubmit={() => deletePerson(formState.id)}
        />

        <Modal
          open={personModalIsOpen}
          modalHeading={
            editingMode === EditingState.CREATE
              ? "Add dossier"
              : "Update dossier"
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
                onChange={e =>
                  handleTextInputChange(e, "email", [Validations.IsRequired])
                }
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

        <LTable
          title="dossiers"
          openModal={() => setPersonModalOpen(true)}
          openDeleteModal={() => setDeleteModalOpen(true)}
          updateFormState={data => setFormState(data)}
          updateEditingMode={setEditingMode}
          onBatchDelete={(selectedRawRowsData: any[]) => {
            setLoading(true)

            const promises = selectedRawRowsData.map(data =>
              deletePersonRequest(data),
            )

            Promise.all(promises).then(() => {
              setLoading(false)

              window.location.reload()
            })
          }}
          rawRowData={people.map(p => ({ ...p, id: `${p.id}` }))}
          rowData={people
            .map(p => ({
              ...p,
              id: `${p.id}`,
              dob:
                p.dob !== null ? moment.utc(p.dob).format("YYYY-MM-DD") : "-",
              link: (
                <a href={`/appledore/${p.id}`}>
                  <Launch20 className={styles.icon} />
                </a>
              ),
            }))
            .sort((a, b) => {
              if (people.length < 2) {
                return 0
              }

              if (a.last_name < b.last_name) {
                return -1
              }
              if (a.last_name > b.last_name) {
                return 1
              }
              if (a.last_name.split()[0] === b.last_name.split()[0]) {
                return 0
              }
            })}
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
      </>
    </Page>
  )
}

export default Appledore
