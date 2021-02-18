import React from "react"
import Head from "next/head"
import styles from "../styles/Home.module.scss"
import LHeader from "../global/Header"

export interface Page {
  logout?: Function
  children: any
}

const Home = ({ logout = () => {}, children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>lantern</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500,700&display=swap"
        />
      </Head>

      <main className={styles.main}>
        <LHeader logout={logout} />
        {children}
      </main>
    </div>
  )
}

export default Home
