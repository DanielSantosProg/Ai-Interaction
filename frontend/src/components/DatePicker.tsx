"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  valor?: string; 
  onSelect: (date: Date | undefined) => void;
  placeholder: string;
}

export function DatePicker({ valor, onSelect, placeholder }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const parsedDate = React.useMemo(() => {
    if (!valor) return undefined
    const [d, m, y] = valor.split("/").map(Number)
    if (!d || !m || !y) return undefined
    const date = new Date(y, m - 1, d)
    return isNaN(date.getTime()) ? undefined : date
  }, [valor])

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={valor ?? ""}
          placeholder={placeholder}
          className="bg-background w-36"
          onChange={(e) => {
            const inputValue = e.target.value
            const cleanValue = inputValue.replace(/\D/g, "")

            let formattedValue = ""
            if (cleanValue.length > 0) {
              let day = cleanValue.substring(0, 2)
              if (day.length === 2 && parseInt(day, 10) > 31) day = "31"
              formattedValue += day
            }
            if (cleanValue.length >= 3) {
              let month = cleanValue.substring(2, 4)
              if (month.length === 2 && parseInt(month, 10) > 12) month = "12"
              formattedValue += "/" + month
            }
            if (cleanValue.length >= 5) {
              const year = cleanValue.substring(4, 8)
              formattedValue += "/" + year
            }
            
            onSelect(
              formattedValue.length === 10
                ? new Date(
                    Number(formattedValue.split("/")[2]),
                    Number(formattedValue.split("/")[1]) - 1,
                    Number(formattedValue.split("/")[0])
                  )
                : undefined
            )
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Selecione a Data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={parsedDate}
              onSelect={(date) => {
                onSelect(date)
                setOpen(false)
              }}
              captionLayout="dropdown"
              month={parsedDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
