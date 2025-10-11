import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

interface AssetData {
  name: string
  value: number
  ticker: string
  shares: number
}

interface Props {
  data: AssetData[]
  totalBalance: number
}

export default function AssetDistributionChart({ data, totalBalance }: Props) {
  const processedData = useMemo(() => {
    if (!data || data.length === 0 || totalBalance === 0) {
      return []
    }

    const sortedData = [...data].sort((a, b) => b.value - a.value)

    let chartData: AssetData[]

    if (sortedData.length > 5) {
      const top4 = sortedData.slice(0, 4)
      const otherValues = sortedData
        .slice(4)
        .reduce((acc, asset) => acc + asset.value, 0)
      const otherAsset = { name: 'Other', value: otherValues, ticker: 'Other', shares: 0}
      chartData = [...top4, otherAsset]
    } else {
      chartData = sortedData
    }

    return chartData.map((asset) => ({
      ...asset,
      percentage: (asset.value / totalBalance) * 100,
    }))
  }, [data, totalBalance])

  if (processedData.length === 0) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis
          type="category"
          dataKey="ticker"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'black', fontSize: '0.7vw' }}
          interval={0}
          width={80}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Allocation']}
        />
        <Bar
          dataKey="percentage"
          fill="#8884d8"
          background={{ fill: '#eee', opacity: 0.2 }}
          radius={[5, 5, 5, 5]}
        >
          <LabelList
            dataKey="percentage"
            position="right"
            // @ts-expect-error formater type err
            formatter={(value: number) => `${value.toFixed(1)}%`}
            style={{ fill: 'black', fontSize: '0.7vw' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
