import React from "react"
import { createMuiTheme } from "@material-ui/core/styles"
import { getBaseURL } from "../constants"
import { ThemeProvider } from "@material-ui/styles"
import Cookies from "js-cookie"

import "../styles/globals.css"
import "../styles/app.scss"
// import Page from "../global/Page"
import { endpoint } from "../helpers/api"
import Page from "../global/Page"

export interface AppContext {
  loggedIn: boolean
  logout: Function
  logIn: Function
  baseurl: string
}

// const theme = createMuiTheme({
//   palette: {
//     type: "dark",
//   },
// })

const loggedIn = Cookies.get("logged_in")
const baseURL = getBaseURL(process.env.LANTERN_ENV)
const uc: AppContext = {
  loggedIn,
  logout: () => {
    fetch(endpoint(baseURL, "/auth/logout"), {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then(r => {
      window.location.replace("/appledore")
    })
  },
  logIn: () => Cookies.set("logged_in", true),
  baseurl: baseURL,
}

export const UserContext = React.createContext(uc)

function Lantern({ Component, pageProps }) {
  return (
    // <ThemeProvider theme={theme}>
    <UserContext.Provider value={uc}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </UserContext.Provider>
    // </ThemeProvider>
  )
}

Lantern.getInitialProps = async () => {
  return {
    props: {
      baseurl: getBaseURL(process.env.LANTERN_ENV),
    },
  }
}

export default Lantern
