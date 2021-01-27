import React, { useState, useEffect } from "react"
import Page from "../global/Page"

import { createMuiTheme } from "@material-ui/core/styles"
import Meh from "./widgets/meh"

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
})

export default function Home() {
  return (
    <Page>
      <div>
        <Meh />
      </div>
    </Page>
  )
}
