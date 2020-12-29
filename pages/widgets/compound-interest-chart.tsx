import React, { useState } from "react"
import { Line, ResponsiveLine } from "@nivo/line"

const styles = require("./compound-interest-chart.module.scss")

interface InterestChartProps {
  finalAmount: string
  annualSavings: number[]
}

const InterestChart: React.FC<InterestChartProps> = ({
  finalAmount,
  annualSavings = [],
}: InterestChartProps) => {
  const formattedData = annualSavings.map((v, i) => ({
    x: i,
    y: annualSavings[i],
  }))

  return (
    <div className={styles.wrapper}>
      <p>{finalAmount}</p>

      {annualSavings.length > 0 && (
        <ResponsiveLine
          enableGridX={false}
          enableGridY={false}
          enableArea={false}
          useMesh
          pointSize={10}
          margin={{
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          }}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            legend: "Net worth",
            legendOffset: -20,
            legendPosition: "middle",
            format: ">-",
            tickSize: 100,
            tickPadding: 5,
          }}
          axisBottom={{
            legend: "Years",
            format: ">-",
            legendOffset: -20,
            legendPosition: "middle",
            tickSize: 100,
            tickPadding: 5,
          }}
          data={[
            {
              id: "savings",
              color: "hsl(142, 70%, 50%)",
              data: formattedData,
            },
          ]}
        />
      )}
    </div>
  )
}

export default InterestChart
