import "../styles/globals.css"
import "../styles/app.scss"
import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"

function MyApp({ Component, pageProps }) {
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
