import React, { useEffect, useState } from "react";
import { DayPicker, type DateRange, type OnSelectHandler } from "react-day-picker";
import DefaultButton, { type DefaultButtonProps } from "../button/DefaultButton";
import { DeafultDropDown } from "../dropdown/DefaultDropDown";
import { format } from "date-fns";
import type { ComponentColors, ComponentVariant } from "../Components.styles";
import { FaCalendarAlt } from "react-icons/fa";

interface DateRangePickerProps {
  /** Controlled date range */
  value: DateRange | undefined;
  /** Called on selection change */
  onChange: OnSelectHandler<DateRange | undefined>;
  /** Dropdown layout options */
  onDropDownClose?: () => void;
  onDropDownOpen?: () => void;
  uniqueKey?: string;
  disabled?: boolean;
  loading?: boolean;
  menuCustomTailwind?: string;
  position?: "top" | "bottom" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
  variant?: ComponentVariant;
  color?: ComponentColors;
  padding?: [Spacing, Spacing, Spacing, Spacing] | [Spacing, Spacing] | Spacing;
  radius?: [Spacing, Spacing, Spacing, Spacing] | Spacing;
  gapMargin?: Spacing;
  insetPercentage?: number;
  menuAttributes?: {};
  triggerButtonProps?: Partial<DefaultButtonProps>;
}

export default function DateRangePicker({
  value,
  onChange,
  onDropDownClose = () => {},
  onDropDownOpen = () => {},
  uniqueKey = "date-range-dropdown",
  disabled = false,
  loading = false,
  menuCustomTailwind = "",
  position = "bottom-right",
  variant = "filled",
  color = "default",
  padding = "2xs",
  radius = "3xs",
  gapMargin = "3xs",
  insetPercentage = 0,
  menuAttributes = {},
  triggerButtonProps = {},
}: DateRangePickerProps) {
  const [selected, setSelected] = useState<DateRange | undefined>(value);
  const [label, setLabel] = useState<string>("Select date range");

  useEffect(() => {
    console.log("Selected:", selected);
    if (selected?.from && selected?.to) {
      setLabel(`${format(selected.from, "MM/dd/yyyy")} ~ ${format(selected.to, "MM/dd/yyyy")}`);
    } else {
      setLabel("Select date range");
    }
  }, [selected]);

  const handleSelect: OnSelectHandler<DateRange | undefined> = (selected, triggerDate, modifiers, e) => {
    setSelected(selected);
    onChange(selected, triggerDate, modifiers, e);
  };

  return (
    <DeafultDropDown
      {...{
        renderTrigger: (triggerRef, toggle, { isOpen }, triggerAttrs) => (
          <DefaultButton
            {...{
              ref: triggerRef as React.Ref<HTMLButtonElement>,
              onClick: toggle,
              disabled,
              loading,
              stretch: "fit",
              padding: "2xs",
              radius: "3xs",
              slim: true,
              customTailwind: "h-full text-s !justify-start",
              attributes: { ...triggerAttrs },
              ...triggerButtonProps,
            }}
          >
            <span className="relative flex items-center">
              <span className="invisible flex flex-row items-center justify-start gap-2xs">00/00/0000 ~ 00/00/0000</span>
              <span className="absolute left-0 flex w-full flex-row items-center justify-start gap-2xs">{label}</span>
              <span className="ml-2xs">
                <FaCalendarAlt />
              </span>
            </span>
          </DefaultButton>
        ),
        renderOptions: [
          (key, toggleDropdown, dropDownState, optionProps) => {
            return (
              <div key={key} className="flex h-full w-full flex-row items-start justify-start gap-2xs">
                <div className="flex h-full flex-col items-start justify-start gap-2xs">
                  <DefaultButton
                    {...{
                      onClick: () => {},
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">Today</span>
                  </DefaultButton>
                  <DefaultButton
                    {...{
                      onClick: () => {},
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">Yesterday</span>
                  </DefaultButton>
                  <DefaultButton
                    {...{
                      onClick: () => {},
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">Last 7 days</span>
                  </DefaultButton>
                  <DefaultButton
                    {...{
                      onClick: () => {},
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">Last 30 days</span>
                  </DefaultButton>
                  <DefaultButton
                    {...{
                      onClick: () => {},
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">This month</span>
                  </DefaultButton>
                  <DefaultButton
                    {...{
                      onClick: () => {},
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">Last month</span>
                  </DefaultButton>
                  <DefaultButton
                    {...{
                      onClick: (e) => {
                        handleSelect(undefined, new Date(), {}, e);
                      },
                      disabled,
                      loading,
                      stretch: "full",
                      padding,
                      radius,
                      slim: true,
                      variant: "text",
                      color: "middleground",
                      customTailwind: "text-t !text-highlight light:!text-highlight-800",
                    }}
                  >
                    <span className="relative flex w-full items-center justify-start">Clear</span>
                  </DefaultButton>
                </div>
                <DayPicker
                  disabled={disabled}
                  captionLayout="dropdown"
                  animate
                  dir="ltr"
                  mode="range"
                  numberOfMonths={2}
                  showOutsideDays
                  selected={selected}
                  onSelect={handleSelect}
                />
              </div>
            );
          },
        ],
        onDropDownOpen: () => {
          onDropDownOpen();
        },
        onDropDownClose: () => {
          onDropDownClose();
        },
        uniqueKey,
        menuStretch: "fit",
        menuCustomTailwind,
        position,
        variant,
        color,
        padding,
        radius,
        gapMargin,
        insetPercentage,
        menuAttributes,
      }}
    />
  );
}
