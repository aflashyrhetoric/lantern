import React, { useState, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/Home.module.scss"
import moment from "moment"

import ClipLoader from "react-spinners/ClipLoader"

import { ProductPageStatus, Stocked } from "./api/shared"
import useSWR from "swr"
import GraphicsCardStatus from "./GraphicsCardStatus"
import GraphicsCardTable from "./GraphicsCardTable"

import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
})

export const fetcher = (url) => fetch(url).then((r) => r.json())

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

export interface ProductPageStatusesResponse {
  statuses: ProductPageStatus[]
  isLoading: boolean
  isError: boolean
}

export const useStatuses = (): ProductPageStatusesResponse => {
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

  const alert = statuses
    ? statuses
        .filter((s) => s !== null)
        .map((s) => s.status)
        .includes(Stocked.IN_STOCK)
    : false

  useEffect(() => {
    setInterval(function () {
      setLastUpdated(Date.now())
    }, 3000)
  }, [])

  return (
    <ThemeProvider theme={theme}>
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

        <main className={styles.main}>
          <div style={{ marginBottom: "1.5rem" }}></div>

          <ClipLoader size={60} color="fff" loading={isLoading} />

          {statuses && statuses.length > 0 && !isLoading && (
            <>
              <GraphicsCardStatus
                isAlert={alert}
                lastUpdatedText={
                  lastUpdated && initialLoad
                    ? moment(lastUpdated).from(initialLoad)
                    : "IDK"
                }
              />
              <div style={{ marginBottom: "10px" }} />
              <GraphicsCardTable statuses={statuses} />
            </>
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}
