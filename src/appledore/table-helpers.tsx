import { Launch20 } from "@carbon/icons-react"
import Link from "next/link"
import moment from "moment"

import { Person } from "../../types/person"

const styles = require("./styles.module.scss")

export const peopleToRowData = (people: Person[]) => {
  return people.map(p => ({
    ...p,
    id: `${p.id}`,
    dob: p.dob ? moment(p.dob).format("YYYY-MM-DD") : "-",
    link: (
      <span style={{ cursor: "pointer" }}>
        <Link href={`/appledore/${encodeURIComponent(p.id)}`} passHref>
          <a href="">
            <Launch20 className={styles.icon} />
          </a>
        </Link>
      </span>
    ),
  }))
}

export const headerData = [
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
]
