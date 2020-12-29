import { ThemeProvider } from "@material-ui/core"
import React, { useState } from "react"
import CompoundInterestCalculator from "./widgets/compound-interest-calculator"

const styles = require("./utilities.module.scss")

interface UtilitiesProps {
  text?: string
}

const Utilities: React.FC<UtilitiesProps> = ({
  text = "hi",
}: UtilitiesProps) => {
  const [something, setSomething] = useState(text)

  return (
    <div className={styles.page}>
      <h1>Utilities</h1>
      <div className={styles.pageInner}>
        <CompoundInterestCalculator />
      </div>
    </div>
  )
}

export default Utilities
