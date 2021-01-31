import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"

import Page from "../../global/Page"
import { endpoint } from "../../helpers/api"
import { Person } from "../../types"

const Dossier = () => {
  const router = useRouter()
  const { person_id } = router.query

  const [person, setPerson] = useState<Person>(null)
  const [loading, setLoading] = useState(false)

  const loadData = () =>
    fetch(endpoint(`/people/${person_id}`))
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

  return (
    <Page>
      {person && (
        <>
          <p>FirstName: {person.first_name}</p>
          <p>LastName: {person.last_name}</p>
          <p>Career: {person.career}</p>
          <p>Email: {person.email}</p>
          <p>Address: {person.address}</p>
          <p>Mobile: {person.mobile}</p>
          <br />
          <h2>Notes</h2>
          {!person.notes || (person.notes.length == 0 && <p>No notes</p>)}
          {person.notes && person.notes.length > 0 && (
            <ul>
              {person.notes.map(n => (
                <li>{n.text}</li>
              ))}
            </ul>
          )}
          <br />
          <h2>Pressure Points</h2>
          {!person.pressure_points ||
            (person.pressure_points.length == 0 && (
              <p>No pressure points. Yet.</p>
            ))}
          {person.pressure_points && person.pressure_points.length > 0 && (
            <ul>
              {person.pressure_points.map(n => (
                <li>{n.description}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </Page>
  )
}

export default Dossier
