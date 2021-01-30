import React, { useState, useEffect } from "react"
import Page from "../global/Page"
import LTable from "../global/LTable"

// interface AppledoreProps {
//   something: string;
// }

// export async function getServerSideProps() {
//   // Fetch data from external API
//   const res = await fetch(`http://localhost:8080/people`)
//   let data = await res.json()

//   // Pass data to the page via props
//   return { props: { data: data.data } }
// }

const Appledore: React.FC = () => {
  const [people, setPeople] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/people")
      .then(response => response.json())
      .then(data => setPeople(data.data))
  }, [])

  return (
    <Page>
      {people && people.length > 0 && (
        <>
          <LTable
            title="dossiers"
            rowData={people}
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
          />
        </>
        // <ul>
        //   {people.map(p => (
        //     <li>{p.first_name}</li>
        //   ))}
        // </ul>
      )}
    </Page>
  )
}

export default Appledore
