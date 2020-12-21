import React, { useState } from "react"

interface CompoundInterestCalculatorProps {}

const calculateInterest = (
  initialPrinciple: number,
  monthlyContributions: number,
  years: number,
) => {
  const annualInterest = 0.08
  const compoundingFrequency = 1 /* per year */
  const parenthetical = annualInterest / compoundingFrequency + 1
  const exponent = compoundingFrequency * years
  const parentheticalToTheExponent = Math.pow(parenthetical, exponent)

  const annualContributions = monthlyContributions * 12

  const number =
    (initialPrinciple + annualContributions) * parentheticalToTheExponent
  return new Intl.NumberFormat().format(number)
}

const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({}: CompoundInterestCalculatorProps) => {
  const [principal, setPrinciple] = useState(599.99)
  const [years, setYears] = useState(10)
  const [monthlyContributions, setMonthlyContributions] = useState(0)

  return (
    <>
      <h2>(Approximate) Opportunity Cost Calculator</h2>
      <h4>Parameters:</h4>
      <ul>
        <li>Initial principle: $30,000</li>
        <li>Annual Interest: 8%</li>
        <li>Years Compounded: {years}</li>
        <li>Monthly Contributions: {monthlyContributions}</li>
      </ul>
      <p>Cost</p>
      <input
        value={principal}
        type="text"
        onChange={e =>
          e.target.value === "" ? 0 : setPrinciple(parseFloat(e.target.value))
        }
      />
      <p>Years</p>
      <input
        value={years}
        type="text"
        onChange={e =>
          e.target.value === "" ? 0 : setYears(parseFloat(e.target.value))
        }
      />
      <p>Monthly Contribution</p>
      <input
        value={monthlyContributions}
        type="text"
        onChange={e => setMonthlyContributions(parseFloat(e.target.value))}
      />

      <p>${calculateInterest(principal, monthlyContributions, years)}</p>
    </>
  )
}

export default CompoundInterestCalculator
