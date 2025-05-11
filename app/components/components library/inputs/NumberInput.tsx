import React from "react";
import clsx from "clsx";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  onSubmit?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  customClass?: string;
  customTailwind?: string;
  disabled?: boolean;
};

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onSubmit,
  min,
  max,
  step = 1,
  customClass = "",
  customTailwind = "",
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  const increment = () => {
    const next = value + step;
    onChange(max !== undefined ? Math.min(next, max) : next);
  };

  const decrement = () => {
    const prev = value - step;
    onChange(min !== undefined ? Math.max(prev, min) : prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit?.(e);
    if (e.key === "ArrowUp") increment();
    if (e.key === "ArrowDown") decrement();
  };

  return (
    <div className={clsx("flex items-center space-x-1", customClass, customTailwind)}>
      <button type="button" onClick={decrement} disabled={disabled} className="rounded bg-gray-200 px-2 py-1 disabled:opacity-50">
        –
      </button>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-16 rounded border px-2 py-1 text-center disabled:opacity-50"
      />
      <button type="button" onClick={increment} disabled={disabled} className="rounded bg-gray-200 px-2 py-1 disabled:opacity-50">
        +
      </button>
    </div>
  );
};

export default NumberInput;
