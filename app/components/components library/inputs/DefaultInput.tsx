import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { inputVariants } from "./DefaultInput.styles";
import { MdDateRange } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import NumberInput from "./NumberInput";
import {
  componentPadding,
  componentPaddingRight,
  componentPaddingX,
  componentPaddingY,
  componentRadius,
  componentRadiusBottomLeft,
  componentRadiusBottomRight,
  componentRadiusTopLeft,
  componentRadiusTopRight,
  componentStretchW,
  type ComponentColors,
  type ComponentSize,
  type ComponentVariant,
} from "../Components.styles";

type InputTypes = React.HTMLInputTypeAttribute;
type DefaultInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type: InputTypes;
  customClass?: string;
  customTailwind?: string;
  value?: string | number | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ComponentVariant;
  color?: ComponentColors;
  stretch?: ComponentSize;
  padding?: [Spacing, Spacing] | Spacing;
  radius?: [Spacing, Spacing, Spacing, Spacing] | Spacing;
  slim?: boolean;
  textSize?: FontSize;
  attributes?: { name: string; [key: string]: any };
  step?: number;
  min?: number;
  max?: number;
};

export default function DefaultInput({
  type = "text",
  customClass = "default-input",
  customTailwind = "",
  value = "",
  onChange = (e) => console.log("No onChange handler provided"),
  onSubmit,
  disabled = false,
  loading = false,
  variant = "filled",
  color = "default",
  stretch = "fit",
  padding = "2xs",
  radius = "2xs",
  slim = false,
  textSize = "p",
  attributes = { name: "" },
  min,
  max,
  step,
}: DefaultInputProps) {
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  // If the initial value exists, assume it's in "YYYY-MM-DD" format and split it.
  const [day, setDay] = useState(typeof value === "string" && type === "date" ? value.split("-")[2] : "");
  const [month, setMonth] = useState(typeof value === "string" && type === "date" ? value.split("-")[1] : "");
  const [year, setYear] = useState(typeof value === "string" && type === "date" ? value.split("-")[0] : "");

  // Refs for the three inputs
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLInputElement>(null);

  // Whenever any of the date parts changes, update the combined date.
  useEffect(() => {
    // Only trigger onChange if all parts have a value
    if (day && month && year && type === "date") {
      // Ensure day and month are two digits
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const event = {
        target: {
          value: formattedDate,
          name: attributes.name || "",
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  }, [day, month, year, type, attributes.name]);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // keep only digits
    if (value.length <= 2) {
      setDay(value);
      if (value.length === 2 && monthRef.current) {
        monthRef.current.focus();
      }
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setMonth(value);
      if (value.length === 2 && yearRef.current) {
        yearRef.current.focus();
      }
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    // Allow up to 4 digits for a full year, or adapt as needed
    if (value.length <= 4) {
      setYear(value);
    }
  };

  const allowedTypes: InputTypes[] = ["text", "password", "date", "email", "number", "search", "tel", "url"];
  const validatedType = allowedTypes.includes(type) ? type : "text";

  switch (validatedType) {
    case "date":
      return (
        <div
          className={clsx(`grid grid-cols-[1fr_1fr_1fr_auto] items-center justify-start gap-2xs`, componentStretchW[stretch])}
          style={{ height: "auto" }}
        >
          <input
            ref={dayRef}
            type="text"
            disabled={disabled || loading}
            inputMode="numeric"
            value={day ?? ""}
            onChange={handleDayChange}
            placeholder="DD"
            className={clsx(
              `${customClass} ${customTailwind} ease relative flex max-w-full flex-row items-center justify-start overflow-hidden font-sans text-ellipsis transition duration-300 outline-none select-none placeholder:text-muted-text disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
              `text-${textSize}`,
              `w-full`,
              Array.isArray(padding) ? `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}` : `${componentPadding[padding]}`,
              !slim && `${Array.isArray(padding) ? componentPaddingY[padding[1]] : componentPaddingY[padding]}`,
              slim && `${componentPaddingY["4xs"]}`,
              Array.isArray(radius)
                ? clsx(
                    `${componentRadiusTopLeft[radius[0]]}`,
                    `${componentRadiusTopRight[radius[1]]}`,
                    `${componentRadiusBottomLeft[radius[2]]}`,
                    `${componentRadiusBottomRight[radius[3]]}`,
                  )
                : `${componentRadius[radius]}`,
              variant !== "none" && `${inputVariants[variant][color]}`,
            )}
            {...attributes}
          />
          <input
            ref={monthRef}
            type="text"
            disabled={disabled || loading}
            inputMode="numeric"
            value={month ?? ""}
            onChange={handleMonthChange}
            placeholder="MM"
            className={clsx(
              `${customClass} ${customTailwind} ease relative flex max-w-full flex-row items-center justify-start overflow-hidden font-sans text-ellipsis transition duration-300 outline-none select-none placeholder:text-muted-text disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
              `text-${textSize}`,
              `w-full`,
              Array.isArray(padding) ? `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}` : `${componentPadding[padding]}`,
              !slim && `${Array.isArray(padding) ? componentPaddingY[padding[1]] : componentPaddingY[padding]}`,
              slim && `${componentPaddingY["4xs"]}`,
              Array.isArray(radius)
                ? clsx(
                    `${componentRadiusTopLeft[radius[0]]}`,
                    `${componentRadiusTopRight[radius[1]]}`,
                    `${componentRadiusBottomLeft[radius[2]]}`,
                    `${componentRadiusBottomRight[radius[3]]}`,
                  )
                : `${componentRadius[radius]}`,
              variant !== "none" && `${inputVariants[variant][color]}`,
            )}
            {...attributes}
          />
          <input
            ref={yearRef}
            type="text"
            disabled={disabled || loading}
            inputMode="numeric"
            value={year ?? ""}
            onChange={handleYearChange}
            placeholder="YYYY"
            className={clsx(
              `${customClass} ${customTailwind} ease relative flex max-w-full flex-row items-center justify-start overflow-hidden font-sans text-ellipsis transition duration-300 outline-none select-none placeholder:text-muted-text disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
              `text-${textSize}`,
              `w-full`,
              Array.isArray(padding) ? `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}` : `${componentPadding[padding]}`,
              !slim && `${Array.isArray(padding) ? componentPaddingY[padding[1]] : componentPaddingY[padding]}`,
              slim && `${componentPaddingY["4xs"]}`,
              Array.isArray(radius)
                ? clsx(
                    `${componentRadiusTopLeft[radius[0]]}`,
                    `${componentRadiusTopRight[radius[1]]}`,
                    `${componentRadiusBottomLeft[radius[2]]}`,
                    `${componentRadiusBottomRight[radius[3]]}`,
                  )
                : `${componentRadius[radius]}`,
              variant !== "none" && `${inputVariants[variant][color]}`,
            )}
            {...attributes}
          />
          <div
            className={`relative flex aspect-square h-full w-auto cursor-pointer items-center justify-center w-[calc(theme("fontSize.${textSize}")+theme("spacing.${padding}")*2)]`}
          >
            <input
              ref={calendarRef}
              type="date"
              disabled={disabled || loading}
              tabIndex={-1} // Prevent tab focus for better accessibility
              onChange={(e) => {
                const date = e.target.value.split("-");
                setYear(date[0]);
                setMonth(date[1]);
                setDay(date[2]);
              }}
              className="pointer-events-none absolute h-0 w-0 opacity-0"
            />
            <MdDateRange
              className={`h-full w-full`}
              onClick={() => {
                if (calendarRef.current) {
                  if (calendarRef.current && calendarRef.current.showPicker) {
                    calendarRef.current.showPicker();
                  } else {
                    alert("Date picker is not supported in this browser. Please enter the date manually.");
                  }
                }
              }}
            />
          </div>
        </div>
      );
    case "password":
      return (
        <div className={clsx(`relative`, componentStretchW[stretch])}>
          <input
            type={showPassword ? "text" : "password"}
            disabled={disabled || loading}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit?.(e);
            }}
            className={clsx(
              `${customClass} ${customTailwind} ease relative flex w-full flex-row items-center justify-start truncate font-sans transition duration-300 outline-none select-none placeholder:text-muted-text disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
              `text-${textSize}`,
              Array.isArray(padding) ? `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}` : `${componentPadding[padding]}`,
              !slim && `${Array.isArray(padding) ? componentPaddingY[padding[1]] : componentPaddingY[padding]}`,
              slim && `${componentPaddingY["4xs"]}`,
              Array.isArray(radius)
                ? clsx(
                    `${componentRadiusTopLeft[radius[0]]}`,
                    `${componentRadiusTopRight[radius[1]]}`,
                    `${componentRadiusBottomLeft[radius[2]]}`,
                    `${componentRadiusBottomRight[radius[3]]}`,
                  )
                : `${componentRadius[radius]}`,
              variant !== "none" && `${inputVariants[variant][color]}`,
              // Add right padding to make room for the eye icon
              `pr-[calc(theme("fontSize.${textSize}")*2.5)]`,
            )}
            {...attributes}
          />
          <button
            type="button"
            className={clsx(
              `absolute top-1/2 right-0 -translate-y-1/2 transform cursor-pointer transition-colors`,
              componentPaddingRight[Array.isArray(padding) ? padding[0] : padding],
            )}
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled || loading}
            tabIndex={-1} // Prevent tab focus for better accessibility
          >
            {showPassword ? <FaEyeSlash className={`text-${textSize} h-[1em] w-[1em]`} /> : <FaEye className={`text-${textSize} h-[1em] w-[1em]`} />}
          </button>
        </div>
      );
    case "number":
      return (
        <NumberInput
          value={Number(value)}
          onChange={(num) => {
            const event = { target: { value: num, name: attributes.name || "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }}
          onSubmit={onSubmit}
          min={min}
          max={max}
          step={step}
          customClass={customClass}
          customTailwind={customTailwind}
          disabled={disabled || loading}
        />
      );
    default:
      return (
        <input
          type={type}
          disabled={disabled || loading}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.(e);
          }}
          className={clsx(
            customClass,
            customTailwind,
            `ease relative flex max-w-full flex-row items-center justify-start truncate font-sans transition duration-300 outline-none select-none placeholder:text-muted-text disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
            `text-${textSize}`,
            componentStretchW[stretch],
            Array.isArray(padding) ? `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}` : `${componentPadding[padding]}`,
            !slim && `${Array.isArray(padding) ? componentPaddingY[padding[1]] : componentPaddingY[padding]}`,
            slim && `${componentPaddingY["4xs"]}`,
            Array.isArray(radius)
              ? clsx(
                  `${componentRadiusTopLeft[radius[0]]}`,
                  `${componentRadiusTopRight[radius[1]]}`,
                  `${componentRadiusBottomLeft[radius[2]]}`,
                  `${componentRadiusBottomRight[radius[3]]}`,
                )
              : `${componentRadius[radius]}`,
            variant !== "none" && `${inputVariants[variant][color]}`,
          )}
          {...attributes}
        />
      );
  }
}
