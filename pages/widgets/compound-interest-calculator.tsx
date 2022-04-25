import React, { useEffect, useState } from "react"
import moment from "moment"

import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import InterestChart from "./compound-interest-chart"

// const compound = require("compound-interest")

interface CompoundInterestCalculatorProps {}

const calculateInterest = (
  initialPrinciple: number,
  monthlyContributions: number,
  interest: number,
  years: number = 1993 + 40 - 2021, // 13 yrs til i'm 40
) => {
  const COMPOUNDING_FREQUENCY = {
    ANNUAL: 1,
    MONTHLY: 12,
    DAILY: 365,
  }

  const opts = {
    initial: initialPrinciple, // initial balance
    monthly: monthlyContributions, // monthly addition
    interest, // +% interest
    compound: COMPOUNDING_FREQUENCY.ANNUAL, // per what? (per year)
    years, // years
  }

  return [0]

  // return compound.verbose(opts)
}

const CompoundInterestCalculator: React.FC<
  CompoundInterestCalculatorProps
> = ({}: CompoundInterestCalculatorProps) => {
  return <p>"WIP"</p>
  const [rate, setRate] = useState<number>(8)
  const [principal, setPrinciple] = useState(88000)
  const [years, setYears] = useState(10)
  const [monthlyContributions, setMonthlyContributions] = useState<number>(0)
  const [savings, setSavings] = useState([])
  const age = moment().diff(moment("1993-06-19"), "years") + years

  const formattedFinal =
    new Intl.NumberFormat("us-EN", {
      style: "currency",
      currency: "USD",
    }).format(savings[savings.length - 1]) || "-"

  useEffect(() => {
    setSavings(calculateInterest(principal, monthlyContributions, rate, years))
  }, [rate, principal, monthlyContributions, years])

  return (
    <>
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" component="p">
          Net worth @ {age}
        </Typography>
        <Typography variant="h5" component="h5">
          {formattedFinal}
        </Typography>
        <Card style={{ width: "300px", height: "400px", marginTop: "2rem" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Compound Interest Calculator
            </Typography>
            <div style={{ marginBottom: "10px" }} />
            <Typography variant="body2" component="p">
              <TextField
                variant="outlined"
                value={principal}
                type="text"
                label="$ Amount (USD)"
                onChange={e =>
                  setPrinciple(
                    e.target.value as unknown as React.SetStateAction<number>,
                  )
                }
              />
              <div style={{ marginBottom: "10px" }} />
              <TextField
                variant="outlined"
                value={rate}
                type="text"
                label="Interest Rate (%)"
                onChange={e => {
                  const v = e.target.value
                  setRate(parseInt(v, 10))
                }}
              />
              <div style={{ marginBottom: "10px" }} />
              <span style={{ display: "block", marginBottom: "10px" }} />
              <TextField
                variant="outlined"
                value={years}
                type="text"
                label={`Years Compounded at ${rate}%`}
                onChange={e => {
                  if (e.target.value === "") {
                    setYears(0)
                    return
                  }
                  let asNum = parseInt(e.target.value)
                  if (asNum === NaN) {
                    asNum = 10
                  }

                  setYears(asNum)
                }}
              />
              <div style={{ marginBottom: "10px" }} />
              <TextField
                variant="outlined"
                value={monthlyContributions}
                type="text"
                label="Monthly Contributions"
                onChange={e => {
                  const { value } = e.target
                  const isValid = !Number.isNaN(parseFloat(value))
                  if (isValid) {
                    setMonthlyContributions(parseFloat(value))
                  }
                }}
              />
            </Typography>
          </CardContent>
        </Card>
      </div>
      <InterestChart finalAmount={formattedFinal} annualSavings={savings} />
    </>
  )
}

export default CompoundInterestCalculator
