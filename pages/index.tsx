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

import { ProductPageStatus, Stocked } from "./api/shared"
import useSWR from "swr"

export const fetcher = (url) => fetch(url).then((r) => r.json())

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

export function useStatuses() {
  const { data, error } = useSWR("/api/scour", fetcher, {
    refreshInterval: REFRESH_INTERVAL_MS,
  })

  return {
    statuses: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default function Home() {
  const { statuses, isLoading, isError } = useStatuses()

  const initialLoad = Date.now()
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  useEffect(() => {
    setInterval(function () {
      setLastUpdated(Date.now())
    }, 3000)
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
    {
      header: "Purchase",
      key: "link",
    },
  ]

  const alert = statuses
    ? statuses
        .filter((s) => s !== null)
        .map((s) => s.status)
        .includes(Stocked.IN_STOCK)
    : false

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
          {lastUpdated && initialLoad
            ? moment(lastUpdated).from(initialLoad)
            : "IDK"}
        </span>
      </h2>
      <main className={styles.main}>
        <div style={{ marginBottom: "1.5rem" }}></div>

        <ClipLoader size={60} color="fff" loading={isLoading} />

        {statuses && statuses.length > 0 && !isLoading && (
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
                {statuses
                  .filter((s) => s !== null)
                  .map((status: ProductPageStatus) => {
                    return (
                      <TableRow key={JSON.stringify(status)}>
                        <TableCell>{status.vendorName}</TableCell>
                        <TableCell>{status.name}</TableCell>
                        <TableCell>{status.status}</TableCell>
                        <TableCell>
                          <Button
                            color={
                              status.status === Stocked.IN_STOCK
                                ? "primary"
                                : "default"
                            }
                            variant="contained"
                            href={status.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {status.status === Stocked.IN_STOCK
                              ? "Buy"
                              : "Unavailable"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </main>
    </div>
  )
}
