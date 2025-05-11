import React, { useEffect, useState } from "react";

import { type ModalProps } from "~/context/ModalContext";
import DefaultButton from "~/components/components library/button/DefaultButton";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import { IoAddOutline } from "react-icons/io5";

// Define available log levels
type LogLevel = "error" | "warning" | "highlight" | "none";

interface LogFiltersProps {
  errorPatterns: string[];
  warningPatterns: string[];
  highlightPatterns: string[];
  setPatterns: (errorLevel: LogLevel, pattern: string) => void;
}

export default function LogFilters({
  modalState,
  modalKey,
  closeModal,
  errorPatterns,
  warningPatterns,
  highlightPatterns,
  setPatterns,
}: Partial<ModalProps> & LogFiltersProps) {
  const [patternData, setPatternData] = useState<Record<Partial<LogLevel>, string>>({ error: "", warning: "", highlight: "", none: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatternData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPattern = (logLevel: LogLevel) => {
    const pattern = patternData[logLevel];
    if (pattern.trim()) {
      setPatterns(logLevel, pattern);
      setPatternData((prev) => ({ ...prev, [logLevel]: "" }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, logLevel: LogLevel) => {
    if (e.key === "Enter") {
      handleAddPattern(logLevel);
    }
  };

  return (
    <div className="relative flex h-[auto] w-full flex-col justify-start bg-transparent text-text">
      <h4 className="mb-xs block text-h4 font-medium">Filters</h4>

      <div className="grid grid-cols-1 gap-3xs sm:grid-cols-3">
        {/* Error Patterns Section */}
        <div className="flex flex-col items-start justify-start gap-2xs rounded-md bg-middleground p-2xs">
          <h5 className="w-full text-p font-medium text-text">Error Patterns</h5>
          <div className="flex w-full flex-row items-center justify-start gap-3xs">
            <DefaultInput
              type="text"
              value={patternData.error}
              onChange={handleChange}
              attributes={{
                name: "error",
                placeholder: "Add error pattern...",
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e as React.KeyboardEvent<HTMLInputElement>, "error"),
              }}
              stretch="full"
              color="secondary"
              radius={"3xs"}
              slim={true}
              textSize="s"
            />
            <DefaultButton onClick={() => handleAddPattern("error")} slim={true} radius={"3xs"} customTailwind="h-full max-h-full">
              <IoAddOutline className="text-p" />
            </DefaultButton>
          </div>
          <div className="flex flex-wrap gap-2xs">
            {errorPatterns.map((pattern, index) => (
              <div
                key={`error-pattern-tag-${index}`}
                className="flex items-center rounded-(--spacing-3xs) bg-error/20 px-3xs py-4xs text-t text-error"
              >
                {pattern}
              </div>
            ))}
          </div>
        </div>

        {/* Warning Patterns Section */}
        <div className="flex flex-col items-start justify-start gap-2xs rounded-md bg-middleground p-2xs">
          <h5 className="w-full text-p font-medium text-text">Warning Patterns</h5>
          <div className="flex w-full flex-row items-center justify-start gap-3xs">
            <DefaultInput
              type="text"
              value={patternData.warning}
              onChange={handleChange}
              attributes={{ name: "warning", placeholder: "Add warning pattern..." }}
              onKeyDown={(e) => handleKeyPress(e as React.KeyboardEvent<HTMLInputElement>, "warning")}
              stretch="full"
              color="secondary"
              radius={"3xs"}
              slim={true}
              textSize="s"
            />
            <DefaultButton onClick={() => handleAddPattern("warning")} slim={true} radius={"3xs"} customTailwind="h-full max-h-full">
              <IoAddOutline className="text-p" />
            </DefaultButton>
          </div>
          <div className="flex flex-wrap gap-2xs">
            {warningPatterns.map((pattern, index) => (
              <div
                key={`warning-pattern-tag-${index}`}
                className="flex items-center rounded-(--spacing-3xs) bg-warning/20 px-3xs py-4xs text-t text-warning-400"
              >
                {pattern}
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Patterns Section */}
        <div className="flex flex-col items-start justify-start gap-2xs rounded-md bg-middleground p-2xs">
          <h5 className="w-full text-p font-medium text-text">Highlight Patterns</h5>
          <div className="flex w-full flex-row items-center justify-start gap-3xs">
            <DefaultInput
              type="text"
              value={patternData.highlight}
              onChange={handleChange}
              attributes={{ name: "highlight", placeholder: "Add warning pattern..." }}
              onKeyDown={(e) => handleKeyPress(e as React.KeyboardEvent<HTMLInputElement>, "highlight")}
              stretch="full"
              color="secondary"
              radius={"3xs"}
              slim={true}
              textSize="s"
            />
            <DefaultButton onClick={() => handleAddPattern("highlight")} slim={true} radius={"3xs"} customTailwind="h-full max-h-full">
              <IoAddOutline className="text-p" />
            </DefaultButton>
          </div>
          <div className="flex flex-wrap gap-2xs">
            {highlightPatterns.map((pattern, index) => (
              <div
                key={`highlight-pattern-tag-${index}`}
                className="flex items-center rounded-(--spacing-3xs) bg-highlight/20 px-3xs py-4xs text-t text-highlight"
              >
                {pattern}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
