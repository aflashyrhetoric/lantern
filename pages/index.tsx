import { useState, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import moment from "moment"

import Button from "@material-ui/core/Button"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"

import NotificationImportantSharpIcon from "@material-ui/icons/NotificationImportantSharp"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"

import { ProductPageStatus, Stocked } from "../shared"

export default function Home() {
  const [statuses, setStatuses] = useState([])

  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const [alert, setAlert] = useState(false)

  const payAttention = (): Boolean =>
    statuses.some(
      (status: ProductPageStatus) => status.status !== Stocked.SOLD_OUT,
    )

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/scour")
    const results = await response.json()
    setStatuses(results.statuses)
  }

  useEffect(async () => {
    fetchData()
    if (payAttention()) {
      setAlert(true)
    } else {
      setAlert(false)
    }

    setInterval(function () {
      fetchData()
      setLastUpdated(Date.now())
      if (payAttention()) {
        setAlert(true)
      } else {
        setAlert(false)
      }
    }, 60 * 1000 * 5)
  }, [])

  const headers = [
    {
      header: "Product Name",
      key: "Name",
    },
    {
      header: "Status",
      key: "status",
    },
    // {
    //   header: "Button Text",
    //   key: "buttonText",
    // },
    {
      header: "Purchase",
      key: "link",
    },
  ]

  return (
    <div
      className={styles.container}
      style={{ background: !alert ? "#171717" : "red" }}
    >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <h1>
        {!alert && (
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
              alignItems: "center",
            }}
          >
            <span color="white">No action required</span> &nbsp;
            <CheckCircleIcon fontSize="large" style={{ color: "green" }} />
          </div>
        )}
      </h1>

      <h1>
        {alert && (
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
              alignItems: "center",
            }}
          >
            <NotificationImportantSharpIcon style={{ color: "red" }} />
            <NotificationImportantSharpIcon style={{ color: "red" }} />
            <span color="white">CHECK STORES IMMEDIATELY</span> &nbsp;
            <NotificationImportantSharpIcon style={{ color: "red" }} />
            <NotificationImportantSharpIcon style={{ color: "red" }} />
          </div>
        )}
      </h1>

      <h2>
        Last updated at:{" "}
        {lastUpdated
          ? moment(lastUpdated).format("dddd, MMMM Do YYYY, h:mm:ss a")
          : "IDK"}
      </h2>
      <main>
        {statuses && statuses.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell key={header.key}>{header.header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {statuses.map((status) => (
                  <TableRow key={JSON.stringify(status)}>
                    <TableCell>{status.name}</TableCell>
                    <TableCell>{status.status}</TableCell>
                    {/* <TableCell>{status.buttonText}</TableCell> */}
                    <TableCell>
                      <Button variant="contained" href={status.link}>
                        Buy
                      </Button>
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
