import * as React from "react";
import { Select } from "radix-ui";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { SelectLabel } from "@radix-ui/react-select";

// Define a tipagem para as props do componente SelectItem
interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
  children: React.ReactNode;
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-violet11 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[highlighted]:outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";

interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectComponentProps {
    placeholder: string;
    items: SelectItemData[];
    onValueChange: (value: string) => void;
}

const SelectComponent = ({placeholder, items, onValueChange}: SelectComponentProps) => (
  <Select.Root onValueChange={onValueChange}>
    <Select.Trigger
      className="inline-flex h-[20px] sm:h-[25px] items-center justify-center gap-[5px] rounded border-[#3a39393d] border-[.5px] bg-white px-[8px] sm:px-[15px] text-[10px] sm:text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-[#3a39393d]/10 data-[placeholder]:text-[#3A3939]/75"
      aria-label="Food"
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="text-violet11">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden rounded-md rounded-t-none bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport>
          <Select.Group>
            <SelectLabel className="flex justify-center border-b-2 bg-slate-500 text-[12px] text-white font-medium">Interações:</SelectLabel>         
            {items.map((item) => (
                <SelectItem key={item.value} value={item.value} disabled={item.disabled} className="hover:bg-[#3a39393d]/25 text-[2px] !important">{item.label}</SelectItem>
            ))}
          </Select.Group>          
        </Select.Viewport>
        <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default SelectComponent;