import React, { useState, useEffect } from "react"
import Page from "../../global/Page"

import { createMuiTheme } from "@material-ui/core/styles"
import { endpoint } from "@/helpers/api"
import { getBaseURL } from "../../constants"

export async function getStaticProps() {
  return {
    props: {
      baseurl: getBaseURL(process.env.LANTERN_ENV),
    },
  }
}

export default function AddPerson(props) {
  const { baseurl } = props
  const [people, setPeople] = useState([])

  useEffect(() => {
    fetch(endpoint(baseurl, "/people"))
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
