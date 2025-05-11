import clsx from "clsx";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { LuHighlighter } from "react-icons/lu";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import DefaultButton from "~/components/components library/button/DefaultButton";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import LogFilters from "~/components/modal/modals/LogFilters";
import { useModal } from "~/context/ModalContext";

export type LogLevel = "error" | "warning" | "highlight" | "none";

const levelClass: Record<LogLevel, string> = {
  error: "text-error",
  warning: "text-warning",
  highlight: "text-highlight",
  none: "text-text",
};

export default function ContainerIdLogs() {
  const { openModal } = useModal();

  const [filterText, setFilterText] = useState("");
  const [errorPatterns, setErrorPatterns] = useState<string[]>(["error", "fail", "exception", "new"]);
  const [warningPatterns, setWarningPatterns] = useState<string[]>(["warn", "caution", "attention"]);
  const [highlightPatterns, setHighlightPatterns] = useState<string[]>(["hello", "health", "connection", "success"]);
  const [activeLogFilter, setActiveLogFilter] = useState<LogLevel>("none");

  const logEntries = [
    "Tue Apr 15 03:50:28 UTC 2025: Hello from Docker logs!",
    "Tue Apr 15 03:51:00 UTC 2025: Container started initialization.",
    "Tue Apr 15 03:52:15 UTC 2025: Connection established.",
    "Tue Apr 15 03:53:42 UTC 2025: Executed command /bin/bash",
    "Tue Apr 15 03:54:10 UTC 2025: Error: Missing environment variable",
    "Tue Apr 15 03:55:00 UTC 2025: Successfully recovered from error",
    "Tue Apr 15 03:56:30 UTC 2025: Health check passed",
    "Tue Apr 15 03:57:45 UTC 2025: New connection from 192.168.1.10",
    "Tue Apr 15 03:58:50 UTC 2025: Container configuration updated",
    "Tue Apr 15 03:59:59 UTC 2025: Finalizing container startup.",
  ];

  function getLogLevel(entry: string): LogLevel {
    // Check against error patterns
    if (errorPatterns.some((pattern) => entry.includes(pattern))) return "error";
    // Check against warning patterns
    if (warningPatterns.some((pattern) => entry.includes(pattern))) return "warning";
    // Check against highlight patterns
    if (highlightPatterns.some((pattern) => entry.includes(pattern))) return "highlight";

    // Default level
    return "none";
  }

  const setPatterns = (type: LogLevel, pattern: string) => {
    switch (type) {
      case "error":
        setErrorPatterns((prev) => [...prev, pattern]);
        break;
      case "warning":
        setWarningPatterns((prev) => [...prev, pattern]);
        break;
      case "highlight":
        setHighlightPatterns((prev) => [...prev, pattern]);
        break;
      default:
        break;
    }
  };

  const removePattern = (type: LogLevel, pattern: string) => {
    switch (type) {
      case "error":
        setErrorPatterns((prev) => prev.filter((item) => item !== pattern));
        break;
      case "warning":
        setWarningPatterns((prev) => prev.filter((item) => item !== pattern));
        break;
      case "highlight":
        setHighlightPatterns((prev) => prev.filter((item) => item !== pattern));
        break;
      default:
        break;
    }
  };

  const filteredLogs = logEntries.filter((entry) => entry.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div className="item-start flex h-full w-full flex-col justify-start gap-2xs pb-md">
      <div className="flex h-fit w-full flex-row items-center justify-start gap-sm">
        <DefaultInput
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          attributes={{ placeholder: "Filter logs by keyword...", name: "logFilter" }}
          stretch="full"
          radius={"3xs"}
          slim={true}
          textSize="s"
          customTailwind="h-fit"
        />
        <DefaultButton
          {...{
            onClick: () => openModal(<LogFilters {...{ errorPatterns, warningPatterns, highlightPatterns, setPatterns }} />, "static_lg"),
            stretch: "fit",
            color: "accent",
            padding: ["xs", "3xs"],
            radius: "3xs",
            customTailwind: "h-full max-h-full",
          }}
        >
          <div className="flex flex-row items-center justify-start gap-3xs text-t text-text">filters</div>
        </DefaultButton>
        {/* Error filter trigger */}
        <DefaultButton
          {...{
            onClick: () => (activeLogFilter === "error" ? setActiveLogFilter("none") : setActiveLogFilter("error")),
            stretch: "fit",
            color: "error",
            padding: "3xs",
            radius: "3xs",
            customTailwind: `h-full max-h-full ${activeLogFilter === "error" ? "!bg-error/80 !text-error-300" : "!bg-error/10 !text-error"}`,
          }}
        >
          <MdOutlineReportGmailerrorred className="flex flex-row items-center justify-start gap-3xs text-s" />
        </DefaultButton>
        {/* Warning filter trigger */}
        <DefaultButton
          {...{
            onClick: () => (activeLogFilter === "warning" ? setActiveLogFilter("none") : setActiveLogFilter("warning")),
            stretch: "fit",
            color: "warning",
            padding: "3xs",
            radius: "3xs",
            customTailwind: `h-full max-h-full ${activeLogFilter === "warning" ? "!bg-warning/80 !text-warning-600" : "!bg-warning/10 !text-warning-400"}`,
          }}
        >
          <IoWarningOutline className="flex flex-row items-center justify-start gap-3xs text-s" />
        </DefaultButton>
        {/* Highlight filter trigger */}
        <DefaultButton
          {...{
            onClick: () => (activeLogFilter === "highlight" ? setActiveLogFilter("none") : setActiveLogFilter("highlight")),
            stretch: "fit",
            color: "highlight",
            padding: "3xs",
            radius: "3xs",
            customTailwind: `h-full max-h-full ${activeLogFilter === "highlight" ? "!bg-highlight/80 !text-highlight-200" : "!bg-highlight/10 !text-highlight"}`,
          }}
        >
          <LuHighlighter className="flex flex-row items-center justify-start gap-3xs text-s" />
        </DefaultButton>
      </div>
      {/* Logs */}
      <div className="flex h-full flex-col items-start justify-start overflow-auto rounded-(--spacing-2xs) border border-dividers/10 bg-foreground p-xs text-text shadow-lg shadow-dividers/20">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((entry, index) => {
            return (
              <p
                key={`log-entry-${index}`}
                className={clsx("w-full rounded-(--spacing-3xs) px-xs py-3xs text-t hover:bg-background/80", `${levelClass[getLogLevel(entry)]}`)}
              >
                {entry}
              </p>
            );
          })
        ) : (
          <p className="w-full px-xs py-3xs text-alt-text">No logs matching your filter criteria</p>
        )}
      </div>
    </div>
  );
}
