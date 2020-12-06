import { useState, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import moment from "moment"

import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  Loading,
} from "carbon-components-react"

export default function Home() {
  const [statuses, setStatuses] = useState([])

  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/scour")
    const results = await response.json()
    setStatuses(results.statuses)
  }

  useEffect(async () => {
    setInterval(function () {
      fetchData()
      setLastUpdated(Date.now())
    }, 60 * 1000 * 5)
  }, [])

  const headers = [
    {
      header: "Vendor",
      key: "vendor",
    },
    {
      header: "Status",
      key: "status",
    },
    {
      header: "Button Text",
      key: "buttonText",
    },
    {
      header: "Link",
      key: "link",
    },
  ]

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>
        Last updated at:{" "}
        {lastUpdated
          ? moment(lastUpdated).format("dddd, MMMM Do YYYY, h:mm:ss a")
          : "IDK"}
      </h2>
      <main>
        {statuses && statuses.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {statuses.map((status) => (
                  <TableRow key={JSON.stringify(status)}>
                    <TableCell>{status.vendor}</TableCell>
                    <TableCell>{status.status}</TableCell>
                    <TableCell>{status.buttonText}</TableCell>
                    <TableCell>
                      <a href={status.link}>Buy @ {status.vendor}</a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </main>
    </div>
  )
}
