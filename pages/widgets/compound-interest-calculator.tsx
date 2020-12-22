import React, { useState } from "react"

import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

interface CompoundInterestCalculatorProps {}

const calculateInterest = (
  initialPrinciple: string,
  monthlyContributions: string,
  years: number,
) => {
  const annualInterest = 0.1
  const compoundingFrequency = 1 /* per year */
  const parenthetical = annualInterest / compoundingFrequency + 1
  const exponent = compoundingFrequency * years
  const parentheticalToTheExponent = Math.pow(parenthetical, exponent)

  const annualContributions = parseFloat(monthlyContributions) * 12 * years

  const number =
    (parseFloat(initialPrinciple) + annualContributions) *
    parentheticalToTheExponent
  return new Intl.NumberFormat().format(number)
}

const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({}: CompoundInterestCalculatorProps) => {
  const [principal, setPrinciple] = useState("1700")
  const [years, setYears] = useState(10)
  const [monthlyContributions, setMonthlyContributions] = useState("0")

  return (
    <>
      <Card style={{ width: "300px", height: "300px" }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Compound Interest Calculator
          </Typography>
          <Typography variant="h5" component="h2">
            ${calculateInterest(principal, monthlyContributions, years)}
            <div style={{ marginBottom: "10px" }} />
          </Typography>
          <Typography variant="body2" component="p">
            <TextField
              variant="outlined"
              value={principal}
              type="text"
              label="$ Amount (USD)"
              onChange={e => setPrinciple(e.target.value)}
            />
            <div style={{ marginBottom: "10px" }} />
            <TextField
              variant="outlined"
              value={years}
              type="text"
              label="Years Compounded at 8%"
              onChange={e =>
                e.target.value === "" ? 0 : setYears(parseFloat(e.target.value))
              }
            />
            <div style={{ marginBottom: "10px" }} />
            <TextField
              variant="outlined"
              value={monthlyContributions}
              type="text"
              label="Monthly Contributions"
              onChange={e => setMonthlyContributions(e.target.value)}
            />
          </Typography>
        </CardContent>
      </Card>
      {/* <ul>
        <li>Initial principle: $30,000</li>
        <li>Annual Interest: 8%</li>
        <li>Years Compounded: {years}</li>
        <li>Monthly Contributions: {monthlyContributions}</li>
      </ul> */}
    </>
  )
}

export default CompoundInterestCalculator
