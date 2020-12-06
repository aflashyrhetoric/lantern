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

import ClipLoader from "react-spinners/ClipLoader"

import NotificationImportantSharpIcon from "@material-ui/icons/NotificationImportantSharp"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"

import { ProductPageStatus, Stocked } from "../shared"

export default function Home() {
  const [statuses, setStatuses] = useState([])
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [alert, setAlert] = useState(false)
  const [loading, setLoading] = useState(false)

  // HACKswitch to stop loading
  const stopLoading = false

  const payAttention = (): Boolean =>
    statuses.some(
      (status: ProductPageStatus) => status.status !== Stocked.SOLD_OUT,
    )

  const fetchData = async () => {
    if (stopLoading) {
      return
    }

    setLoading(true)
    const response = await fetch("http://localhost:3000/api/scour")
    const results = await response.json()
    setLoading(false)
    setStatuses(results.statuses)
  }

  useEffect(async () => {
    fetchData()
    setLastUpdated(Date.now())
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
      header: "Vendor",
      key: "vendorName",
    },
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
      style={{ background: !alert ? "#171717" : "#4f0000" }}
    >
      <Head>
        <title>{alert ? "ALERT" : "OUT OF STOCK"}</title>
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
              padding: "3rem",
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
        <span style={{ opacity: 0.5 }}>
          {lastUpdated ? moment(lastUpdated).fromNow() : "IDK"}
        </span>
      </h2>
      <main>
        <div style={{ marginBottom: "1.5rem" }}></div>

        <ClipLoader size={60} color="fff" loading={loading} />

        {statuses && statuses.length > 0 && !loading && (
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
                    <TableCell>{status.vendorName}</TableCell>
                    <TableCell>{status.name}</TableCell>
                    <TableCell>{status.status}</TableCell>
                    <TableCell>
                      <Button
                        color={payAttention() ? "primary" : "default"}
                        variant="contained"
                        href={status.link}
                      >
                        {payAttention() ? "Buy" : "Unavailable"}
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
