import React, { useState, useEffect } from "react"
import Page from "../../global/Page"

import { createMuiTheme } from "@material-ui/core/styles"

export default function Home() {
  const [people, setPeople] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/people")
      .then(response => response.json())
      .then(data => setPeople(data.data))
  }, [])

  return (
    <Page>
      <h1>Add People</h1>
      {people && people.length > 0 && (
        <ul>
          {people.map(p => (
            <li>{p.first_name}</li>
          ))}
        </ul>
      )}
    </Page>
  )
}
