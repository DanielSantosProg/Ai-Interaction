"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function MyBarChart({empresa1, empresa2}: {empresa1: string, empresa2: string}) {

    const chartData = [
        { month: "Janeiro", [empresa1]: 186, [empresa2]: 80 },
        { month: "Fevereiro", [empresa1]: 305, [empresa2]: 200 },
        { month: "Março", [empresa1]: 237, [empresa2]: 120 },
        { month: "Abril", [empresa1]: 73, [empresa2]: 190 },
        { month: "Maio", [empresa1]: 209, [empresa2]: 130 },
        { month: "Junho", [empresa1]: 214, [empresa2]: 140 },
    ]

    const chartConfig = {
        [empresa1]: {
            label: empresa1,
            color: "#2563eb",
        },
        [empresa2]: {
            label: empresa2,
            color: "#60a5fa",
        },
    } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={empresa1} fill={`var(--color-${empresa1})`} radius={4} />
        <Bar dataKey={empresa2} fill={`var(--color-${empresa2})`} radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
