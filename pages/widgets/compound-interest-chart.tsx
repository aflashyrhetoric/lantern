import React, { useState } from "react"
import { ResponsiveLine } from "@nivo/line"

interface InterestChartProps {
  annualSavings: number[]
}

const InterestChart: React.FC<InterestChartProps> = ({
  annualSavings = [],
}: InterestChartProps) => {
  return (
    <div style={{ padding: "1rem", height: "350px", width: "350px" }}>
      <ResponsiveLine
        enableGridX={false}
        enableGridY={false}
        // axisLeft={}
        data={[
          {
            id: "savings",
            data: annualSavings.map((v, i) => ({
              x: `${i + 1}`,
              y: annualSavings[i],
            })),
          },
        ]}
      />
    </div>
  )
}

export default InterestChart
