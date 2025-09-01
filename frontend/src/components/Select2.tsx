import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

    interface SelectItemData {
        value: string;
        label: string;
        id?: number;
        disabled?: boolean;
    }
    interface SelectComponentProps {
        placeholder: string;
        items: SelectItemData[];
        onValueChange: (value: string) => void;
        defaultValue?: string;
        value?: string;
    }

export function SelectScrollable({
  placeholder,
  items,
  onValueChange,
  defaultValue,
  value,
}: SelectComponentProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.id ?? item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
