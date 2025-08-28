"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("pt-BR")
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime()) && 
           date.getDate() === parseInt(date.toLocaleDateString("pt-BR").substring(0, 2), 10) &&
           date.getMonth() + 1 === parseInt(date.toLocaleDateString("pt-BR").substring(3, 5), 10);
}

interface DatePickerProps {
  valor?: string;
  onSelect: (date: Date | undefined) => void;
  placeholder: string;
}

export function DatePicker({valor, onSelect, placeholder}:DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(undefined)
  const [value, setValue] = React.useState("")

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder}
          className="bg-background w-36"
          onChange={(e) => {
            const inputValue = e.target.value;            
            // Remove todos os caracteres que não são dígitos
            const cleanValue = inputValue.replace(/\D/g, '');

            let formattedValue = '';
            
            if (cleanValue.length > 0) {
                let day = cleanValue.substring(0, 2);
                if (day.length === 2 && parseInt(day, 10) > 31) {
                    day = '31';
                }
                formattedValue += day;
            }
            
            if (cleanValue.length >= 3) {
                let month = cleanValue.substring(2, 4);
                if (month.length === 2 && parseInt(month, 10) > 12) {
                    month = '12';
                }
                formattedValue += '/' + month;
            }
            
            if (cleanValue.length >= 5) {
                const year = cleanValue.substring(4, 8);
                formattedValue += '/' + year;
            }

            // Atualiza o estado com o valor formatado
            setValue(formattedValue);
            
            // Processa a data, se for válida
            if (formattedValue.length === 10) {
                const parts = formattedValue.split('/');
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                
                const newDate = new Date(year, month - 1, day);
                
                if (newDate.getDate() === day && (newDate.getMonth() + 1) === month) {
                  setDate(newDate);
                  setMonth(newDate);
                  onSelect(newDate);
                } else {
                  setDate(undefined);
                  onSelect(undefined);
                }

              } else {
                setDate(undefined);
                onSelect(undefined);
              }
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
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                onSelect(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
