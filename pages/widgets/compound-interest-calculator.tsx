import React, { useState } from "react"

interface CompoundInterestCalculatorProps {
  text?: string
}

const calculateInterest = (initialPrinciple: number = 0, years: number = 1) => {
  const annualInterest = 0.08
  const compoundingFrequency = 1 /* per year */
  const parenthetical = annualInterest / compoundingFrequency + 1
  const exponent = compoundingFrequency * years
  const parentheticalToTheExponent = Math.pow(parenthetical, exponent)

  return initialPrinciple * parentheticalToTheExponent
}

const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({
  text = "hi",
}: CompoundInterestCalculatorProps) => {
  const [something, setSomething] = useState(text)

  return (
    <button type="button" onClick={() => setSomething("hi")}>
      {calculateInterest(30_000, 5)}
    </button>
  )
}

export default CompoundInterestCalculator
