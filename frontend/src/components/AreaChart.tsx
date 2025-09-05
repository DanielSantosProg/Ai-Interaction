"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Janeiro", Portpolpas: 186, Rei: 80 },
  { month: "Fevereiro", Portpolpas: 305, Rei: 200 },
  { month: "Março", Portpolpas: 237, Rei: 120 },
  { month: "Abril", Portpolpas: 73, Rei: 190 },
  { month: "Maio", Portpolpas: 209, Rei: 130 },
  { month: "Junho", Portpolpas: 214, Rei: 140 },
]

const chartConfig = {
  Portpolpas: {
    label: "Portpolpas",
    color: "#2563eb",
  },
  Rei: {
    label: "Rei",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function MyAreaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Vendas 2025</CardTitle>
        <CardDescription>
          Mostrando vendas por mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />            
            <Area
              dataKey="Portpolpas"
              type="natural"
              fill="var(--color-Portpolpas)"
              fillOpacity={0.4}
              stroke="var(--color-Portpolpas)"
              stackId="a"
            />
            <Area
              dataKey="Rei"
              type="natural"
              fill="var(--color-Rei)"
              fillOpacity={0.4}
              stroke="var(--color-Rei)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Aumentou em 5% nesse ano <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Janeiro - Junho 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
