import "../styles/globals.css"
import "../styles/app.scss"
import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"
import Cookies from "js-cookie"
import Page from "../global/Page"

function MyApp({ Component, pageProps }) {
  const loggedIn = Cookies.get("logged_in")
  const logout = () => {
    fetch(endpoint(baseurl, "/auth/logout"), {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then(r => {
      window.location.replace("/appledore")
    })
  }
  const UserContext = React.createContext({
    logged_in: loggedIn,
    logout,
    logIn: () => Cookies.set("logged_in", true),
  })
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={false}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default MyApp
