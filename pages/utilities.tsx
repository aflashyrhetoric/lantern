import React, { useState } from "react"
import CompoundInterestCalculator from "./widgets/compound-interest-calculator"
import Meh from "./widgets/meh"

const styles = require("./utilities.module.scss")

const Utilities: React.FC = () => {
  return (
    <div className={styles.page}>
      <h1>Utilities</h1>
      <div className={styles.pageInner}>
        <CompoundInterestCalculator />
      </div>
      <div
        style={{
          width: "100%",
          paddingRight: "5rem",
          paddingLeft: "5rem",
        }}
      >
        <Meh />
      </div>
    </div>
  )
}

export default Utilities
