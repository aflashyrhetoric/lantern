import React, { useState } from "react"
import { Line } from "@nivo/line"

interface InterestChartProps {
  annualSavings: number[]
}

const InterestChart: React.FC<InterestChartProps> = ({
  annualSavings = [],
}: InterestChartProps) => {
  const labels = annualSavings.map((v, i) => `${i + 1}`)

  const datasets = [
    {
      values: annualSavings,
    },
  ]

  const data = { labels, datasets }

  return (
    <div>
      <Line
        data={[
          {
            id: "savings",
            data: annualSavings.map((v, i) => ({
              x: i,
              y: annualSavings[i],
            })),
          },
        ]}
        width={350}
        height={350}
      />
    </div>
  )
}

export default InterestChart
