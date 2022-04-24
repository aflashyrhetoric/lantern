import React from "react"

import LTable from "../../global/LTable"
import { deletePersonRequest } from "../../pages/api/person"
import { Person } from "../../types/person"
import { headerData, peopleToRowData } from "./table-helpers"

interface Props {
  baseurl: string
  openModal: (boolean) => void
  openDeleteModal: (boolean) => void
  setFormState: (data: any) => void
  setLoading: (data: any) => void
  setEditingMode: Function
  people: Person[]
}

const ContactsTable: React.FC<Props> = (props: Props) => {
  const {
    baseurl,
    openModal,
    openDeleteModal,
    setFormState,
    setLoading,
    setEditingMode,
    people,
  } = props

  return (
    <LTable
      title={`Contacts (${people.length})`}
      openModal={() => openModal(true)}
      openDeleteModal={() => openDeleteModal(true)}
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
      rawRowData={people || []}
      rowData={people ? peopleToRowData(people) : []}
      headerData={headerData}
      disableBatchEdit
    />
  )
}

export default ContactsTable
