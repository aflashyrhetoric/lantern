import React from "react"
import Head from "next/head"
import styles from "../styles/Home.module.scss"
import LHeader from "../global/Header"

// import "../styles/app.module.scss"

export interface Page {
  children: any
}

const Home = ({ children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>lantern</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500,700&display=swap"
        />
        {/* <link
          rel="stylesheet"
          href="https://unpkg.com/carbon-components@10.27.0/css/carbon-components.min.css"
        /> */}
      </Head>
      <main className={styles.main}>
        <LHeader />
        {children}
      </main>
    </div>
  )
}

export default Home
