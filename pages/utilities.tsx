import React, { useState } from "react"
import CompoundInterestCalculator from "./widgets/compound-interest-calculator"

interface UtilitiesProps {
  text?: string
}

const Utilities: React.FC<UtilitiesProps> = ({
  text = "hi",
}: UtilitiesProps) => {
  const [something, setSomething] = useState(text)

  return <CompoundInterestCalculator />
}

export default Utilities
