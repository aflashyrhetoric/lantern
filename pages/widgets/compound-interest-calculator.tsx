import React, { useState } from "react"

import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

const compound = require("compound-interest")

interface CompoundInterestCalculatorProps {}

/*
  
  
  compound(opts); // 8083
  compound.verbose(opts);
*/

const calculateInterest = (
  initialPrinciple: string,
  monthlyContributions: string,
  years: number = 2033 - 2020, // 13 yrs til i'm 40
) => {
  const annualInterest = 0.1
  const compoundingFrequency = 1 /* per year */
  const parenthetical = annualInterest / compoundingFrequency + 1
  const exponent = compoundingFrequency * years
  const parentheticalToTheExponent = Math.pow(parenthetical, exponent)

  const annualContributions = parseFloat(monthlyContributions) * 12 * years

  const opts = {
    initial: initialPrinciple, // initial balance
    monthly: monthlyContributions, // monthly addition
    interest: 8, // +% interest
    compound: 12, // compounding factor (1, 12, 365...)
    years: years, // years
  }

  const number =
    (parseFloat(initialPrinciple) + annualContributions) *
    parentheticalToTheExponent

  // return new Intl.NumberFormat().format(number)
  return compound(opts)
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
              onChange={e => setYears(e.target.value as number)}
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
    </>
  )
}

export default CompoundInterestCalculator
