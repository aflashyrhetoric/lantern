import React, { useState, useEffect } from "react"
import moment from "moment"

import Page from "../global/Page"
import LTable from "../global/LTable"
import {
  Modal,
  Loading,
  Form,
  FormGroup,
  TextInput,
  DatePicker,
  DatePickerInput,
  TextArea,
} from "carbon-components-react"
import { EditingState, Person } from "../types"
import getHandlers from "../helpers/form/eventHandlers"
import Validations from "../helpers/form/validation"
import { endpoint } from "../helpers/api"

const Appledore: React.FC = () => {
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
    fetch(endpoint("/people"))
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
    fetch(endpoint("/people"), {
      method: "POST",
      body: JSON.stringify(formState) as any,
    }).then(() => resetForm())
  }

  const deletePerson = (person_id: number) => {
    deletePersonRequest(person_id)
      .then(response => response.json())
      .then(data => resetForm())
  }

  const deletePersonRequest = person_id => {
    return fetch(endpoint(`/people/${person_id}`))
  }

  const resetForm = () => {
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
      {people && people.length > 0 && (
        <>
          <Modal
            danger
            open={deleteModalOpen}
            modalHeading="Confirm deletion, master sensei"
            primaryButtonText="yeet"
            secondaryButtonText="nvm"
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
              // if (editingMode === EditingState.UPDATE) {
              //   updatePerson()
              // }
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
                  value={formState && formState.dob}
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
              <FormGroup legendText="">
                <TextArea
                  id="notes"
                  name="notes"
                  value={(formState && formState.notes) || ""}
                  placeholder="In the bleak midwinter..."
                  invalid={invalidFields.includes("notes")}
                  invalidText="A valid value is required"
                  labelText="Notes"
                  onChange={e => handleTextInputChange(e, "notes")}
                />
                <div style={{ marginBottom: "10px" }} />
                <TextArea
                  id="pressure_points"
                  name="pressure_points"
                  value={(formState && formState.pressure_points) || ""}
                  placeholder=""
                  invalid={invalidFields.includes("pressure_points")}
                  invalidText="A valid value is required"
                  labelText="Pressure points"
                  onChange={e => handleTextInputChange(e, "pressure_points")}
                />
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
            rawRowData={people}
            rowData={people.map(p => ({ ...p, id: `${p.id}` }))}
            headerData={[
              {
                header: "ID",
                key: "id",
              },
              {
                header: "First",
                key: "first_name",
              },
              {
                header: "Last",
                key: "last_name",
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
      )}
    </Page>
  )
}

export default Appledore
