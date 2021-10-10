import React, { useState } from "react"
import { TextInput } from "carbon-components-react"
import CompoundInterestCalculator from "./widgets/compound-interest-calculator"
import Meh from "./widgets/meh"
import Page from "../global/Page"

const styles = require("./utilities.module.scss")

const Utilities: React.FC = () => {
  return (
    <>
      <Page>
        <div
          style={{
            width: "100%",
            paddingRight: "5rem",
            paddingLeft: "5rem",
          }}
        >
          <Meh />
        </div>
        <div className={styles.pageInner}>
          <CompoundInterestCalculator />
        </div>
      </Page>
    </>
  )
}

export default Utilities
