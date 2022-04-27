import React, { useState } from "react"
import moment from "moment"
import {
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

import Validations from "@/helpers/form/validation"
import { createPerson, updatePerson } from "@/api/person"
import { RelationshipType } from "@/types/relationship"
import { EditingState } from "@/types/forms"
import { Person } from "@/types/person"
import { enumToSelectItemsWithValuesAsKeys } from "@/helpers/form/carbon-helpers"
import { getName } from "@/helpers/person"
import getHandlers from "@/helpers/form/eventHandlers"

interface Props {
  modalOpen: boolean
  setModalOpen: Function

  baseurl: string

  loading: boolean
  setLoading: Function
  resetForm: () => void

  editingMode: EditingState

  person?: Person // if we're updating
  people: Person[]
}

const PersonFormModal: React.FC<Props> = ({
  modalOpen,
  setModalOpen,

  baseurl,
  loading,
  setLoading,
  resetForm,
  editingMode,
  person,
  people,
}: Props) => {
  const [formState, setFormState] = useState<Person>(person)
  const [invalidFields, setInvalidFields] = useState([])
  const [knowsPersonThroughSomeoneElse, setKnowsPersonThroughSomeoneElse] =
    useState(false)
  const { handleTextInputChange, handlePhoneNumberInputChange } = getHandlers(
    formState,
    setFormState,
    invalidFields,
    setInvalidFields,
  )

  return (
    <Modal
      open={modalOpen}
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
          createPerson(baseurl, formState, resetForm)
        }
        if (editingMode === EditingState.UPDATE) {
          updatePerson(baseurl, formState, formState.id, resetForm)
        }
      }}
      onRequestClose={() => {
        resetForm()
        setModalOpen(false)
      }}
      onBlur={() => {
        resetForm()
        setModalOpen(false)
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
  )
}

export default PersonFormModal
