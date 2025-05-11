import type { Route } from "./+types/containers.$id.logs";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import type { DateRange } from "react-day-picker";
import { FaChevronDown } from "react-icons/fa";
import DateRangePicker from "~/components/components library/date range picker/DateRangePicker";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

export type Log = { timeStamp: string; message: string };

export default function ContainerIdLogs({ params }: Route.ComponentProps) {
  const { id } = params;
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<{ text: string; dateRange: DateRange | undefined }>({
    text: "",
    // dateRange: undefined,
    dateRange: {
      from: (() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return sevenDaysAgo;
      })(),
      to: new Date(),
    },
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const queueRef = useRef<Log[]>([]);
  const listRef = useRef<FixedSizeList>(null);

  // Optimize filtering with useMemo
  useEffect(() => {
    console.log("logs...", logs.length);
    const filteredResults = logs.filter((entry) => {
      // Text filtering
      const matchesText = filter.text === "" || entry.message.includes(filter.text) || entry.timeStamp.includes(filter.text);

      // Date range filtering - only do this work if text filter passes
      if (!matchesText) return false;

      // Optimize date parsing (only do it if we have date filters)
      if (!filter.dateRange?.from && !filter.dateRange?.to) return true;

      const entryDate = new Date(entry.timeStamp);

      const fromDate = filter.dateRange?.from ? new Date(filter.dateRange.from).setHours(0, 0, 0, 0) : null; // Set time to start of day for the 'from' date
      const toDate = filter.dateRange?.to ? new Date(filter.dateRange.to).setHours(23, 59, 59, 999) : null; // Set time to end of day for the 'to' date

      return (!fromDate || entryDate.getTime() >= fromDate) && (!toDate || entryDate.getTime() <= toDate);
    });

    setFilteredLogs(filteredResults);
  }, [logs, filter.text, filter.dateRange]);

  // scroll to bottom on new logs if auto-scroll is enabled
  useEffect(() => {
    if (isAutoScroll && listRef.current) {
      listRef.current.scrollToItem(filteredLogs.length - 1);
    }
  }, [filteredLogs, isAutoScroll]);

  useEffect(() => {
    console.log(`Setting up WebSocket for ${id}...`);
    const ws = new WebSocket(`ws://${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}/ws/logs/${id}`);

    ws.onopen = () => {
      console.log(`WS connected for ${id}`);
      setConnected(true);
      setConnecting(false);
    };
    ws.onmessage = (evt) => {
      console.log(`WS LOG: ${evt.data}...`);
      const logString = evt.data;
      // Match ISO timestamp at beginning followed by the message
      const match = logString.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s+(.*)/);

      let entry: Log;
      if (match) {
        const [, timestamp, message] = match;
        entry = { timeStamp: timestamp, message };
      } else {
        entry = { timeStamp: new Date().toISOString(), message: logString };
      }
      queueRef.current.push(entry);
    };
    ws.onerror = (err) => {
      console.error("WS error", err);
      setConnecting(false);
    };
    ws.onclose = () => {
      console.log(`WS closed for ${id}`);
      setConnected(false);
      setConnecting(false);
      // flush any remaining logs on close
      if (queueRef.current.length) {
        setLogs((prev) => [...prev, ...queueRef.current.splice(0)]);
      }
    };

    // Important for cleanup!
    return () => {
      console.log(`Cleaning up WebSocket for ${id}`);
      ws.close();
    };
  }, [id]);

  // flush buffered logs in small batches to avoid UI lag
  useEffect(() => {
    const flushInterval = setInterval(() => {
      if (queueRef.current.length) {
        setLogs((prev) => [...prev, ...queueRef.current.splice(0, 50)]);
      }
    }, 200);
    return () => {
      // flush remaining buffered logs
      if (queueRef.current.length) {
        setLogs((prev) => [...prev, ...queueRef.current.splice(0)]);
      }
      clearInterval(flushInterval);
    };
  }, []);

  return (
    <div key={`logs-${id}`} className="item-start flex h-full w-full flex-col justify-start gap-2xs pb-md">
      {/* Filter input and Tail dropdown */}
      <div className="flex h-fit w-full flex-row items-center justify-start gap-sm">
        <DefaultInput
          type="text"
          value={filter.text}
          onChange={(e) => setFilter((prev) => ({ ...prev, text: e.target.value }))}
          attributes={{ placeholder: "Filter logs by keyword...", name: "logFilter" }}
          stretch="full"
          radius={"3xs"}
          slim={true}
          textSize="s"
          customTailwind="h-full"
        />
        <DateRangePicker
          {...{
            value: filter.dateRange,
            onChange: (selected) => {
              setFilter((prev) => {
                return { ...prev, dateRange: selected };
              });
            },
          }}
        />
      </div>
      {/* Logs */}
      <div className="relative flex h-full min-h-0 flex-col items-start justify-start rounded-(--spacing-2xs) border border-dividers/10 bg-foreground p-xs text-text shadow-lg shadow-dividers/20">
        <div className="flex h-full w-full">
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={filteredLogs.length}
                itemSize={35}
                itemKey={(index) => `log-entry-${index}-${filteredLogs[index].timeStamp}`}
                ref={listRef}
                onScroll={({ scrollOffset }) => {
                  const atBottom = scrollOffset + height + 5 >= filteredLogs.length * 35;
                  setIsAutoScroll(atBottom);
                }}
              >
                {({ index, style }) => {
                  const log = filteredLogs[index];
                  return (
                    <p
                      style={style}
                      key={`log-entry-${index}-${log.timeStamp}`}
                      className={clsx("w-full rounded-(--spacing-3xs) px-xs py-3xs text-t text-text hover:bg-background/80")}
                    >
                      <span className="text-highlight light:text-highlight-900">
                        {new Date(log.timeStamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </span>
                      <span className="mr-4xs">:</span>
                      <span>{log.message}</span>
                    </p>
                  );
                }}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
        {!isAutoScroll && (
          <button
            className="absolute right-md bottom-md cursor-pointer rounded-full bg-primary p-xs shadow-sm shadow-dividers/10"
            onClick={() => {
              if (listRef.current) {
                listRef.current.scrollToItem(filteredLogs.length - 1);
                setIsAutoScroll(true);
              }
            }}
          >
            <FaChevronDown className="text-text" />
          </button>
        )}
      </div>
    </div>
  );
}
