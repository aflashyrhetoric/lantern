import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Button, ButtonSet, Modal, TextInput } from "carbon-components-react"

import Page from "@/global/Page"
import getHandlers from "@/helpers/form/eventHandlers"
import { endpoint } from "@/helpers/api"
import { getBaseURL } from "@/constants"
import { deletePerson } from "@/api/person"

import { AuthType, EditingState, Person } from "@/types"

import ContactsTable from "@/lantern/appledore/contacts-table"
import LoginModal from "@/lantern/appledore/login-modal"
import { logout } from "@/lantern/appledore/auth"
import PersonFormModal from "@/lantern/appledore/person-form"

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

        <PersonFormModal
          baseurl={baseurl}
          modalOpen={personModalIsOpen}
          setModalOpen={setPersonModalOpen}
          loading={loading}
          setLoading={setLoading}
          resetForm={resetForm}
          editingMode={editingMode}
          people={filteredPeople}
        />

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
