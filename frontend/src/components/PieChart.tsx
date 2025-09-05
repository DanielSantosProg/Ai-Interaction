"use client"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function MyPieChart() {

    const chartData = [
        { empresa: "Rei", vendas: 225, fill: "var(--color-chrome)" },
        { empresa: "Portpolpas", vendas: 200, fill: "var(--color-safari)" },
    ]

    const chartConfig = {
        vendas: {
            label: "Vendas",
        },
        chrome: {
            label: "Chrome",
            color: "#2563eb",
        },
        safari: {
            label: "Safari",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
            <CardTitle>Gráfico de Vendas 2025</CardTitle>
            <CardDescription>Janeiro - Setembro 2025</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
            <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
            >
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="vendas" label nameKey="empresa" />
            </PieChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
            Aumentou em 5% nesse ano <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
            Mostrando o total de vendas nesse mês
            </div>
        </CardFooter>
        </Card>
    )
}

