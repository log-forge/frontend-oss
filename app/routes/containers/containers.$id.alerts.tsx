import type { Route } from "./+types/containers.$id.alerts";
import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { data } from "react-router";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import { getContainerFilteredLogs, invalidateContainerAlerts, invalidateContainerFilteredLogs } from "~/utils/tanstack/queries/containerQueries";
import DefaultButton from "~/components/components library/button/DefaultButton";
import { useModal } from "~/context/ModalContext";
import EditKeywords from "~/components/modal/modals/EditKeywords";
import { FaChevronDown } from "react-icons/fa";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const filteredLogs = await getContainerFilteredLogs(params.id);
    return data({ filteredLogs: filteredLogs }, { status: 200 });
  } catch (error) {
    console.error("Error loading container filtered logs:", error);
    return data({ filteredLogs: [] }, { status: 400 });
  }
}

export default function ContainerIdLogs({ loaderData, params }: Route.ComponentProps) {
  const { filteredLogs: fetchedFilteredLogs } = loaderData;
  const { id } = params;
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState({ text: "" });
  const [doubleFilteredLogs, setDoubleFilteredLogs] = useState<string[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const {
    isFetching,
    isPending,
    isError,
    data: filteredLogs,
    error,
  } = useQuery<string[]>({
    queryKey: ["filteredLogs", id],
    queryFn: async () => await getContainerFilteredLogs(id),
    initialData: fetchedFilteredLogs,
    enabled: useIsFetching({ queryKey: ["filteredLogs", id] }) === 0,
    refetchInterval: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
  });

  // derive filtered logs whenever logs or filter.text changes
  useEffect(() => {
    setDoubleFilteredLogs(filteredLogs?.filter((entry) => entry.includes(filter.text)) || []);
  }, [filteredLogs, filter.text, isFetching]);

  useEffect(() => {
    if (isAutoScroll && logsContainerRef.current) logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  }, [doubleFilteredLogs, isAutoScroll]);

  const handleScroll = () => {
    const el = logsContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= 5;
    setIsAutoScroll(atBottom);
  };

  const invalidateAlerts = () => {
    invalidateContainerFilteredLogs(queryClient, id);
    invalidateContainerAlerts(queryClient);
    setTimeout(() => {
      invalidateContainerFilteredLogs(queryClient, id);
      invalidateContainerAlerts(queryClient);
    }, 4000); // wait for 1 second before invalidating alerts
  };

  return (
    <div className="item-start flex h-full w-full flex-col justify-start gap-2xs pb-md">
      {/* Filter input and Tail dropdown */}
      <div className="flex h-fit w-full flex-row items-center justify-start gap-sm">
        <DefaultInput
          type="text"
          disabled={isError}
          loading={isPending}
          value={filter.text}
          onChange={(e) => setFilter((prev) => ({ ...prev, text: e.target.value }))}
          attributes={{ placeholder: "Filter logs by keyword...", name: "logFilter" }}
          stretch="full"
          radius={"3xs"}
          slim={true}
          textSize="s"
          customTailwind="h-full"
        />
        <DefaultButton
          {...{
            onClick: () => {
              openModal(<EditKeywords invalidateAlerts={invalidateAlerts} />, "static_md");
            },
            color: "accent",
            stretch: "fit",
            padding: "2xs",
            radius: "3xs",
            customTailwind: "h-full max-h-full text-s !justify-start",
            slim: true,
          }}
        >
          <div className="flex flex-row items-center justify-start gap-3xs text-s text-text">Edit Keys</div>
        </DefaultButton>
      </div>
      {/* Logs */}
      <div className="flex h-full min-h-0 flex-col items-start justify-start rounded-(--spacing-2xs) border border-dividers/10 bg-foreground p-xs text-text shadow-lg shadow-dividers/20">
        <div ref={logsContainerRef} onScroll={handleScroll} className="flex h-full w-full flex-col items-start justify-start [overflow:overlay]">
          {doubleFilteredLogs.length > 0 ? (
            doubleFilteredLogs.map((log, index) => {
              return (
                <p
                  key={`filtered-log-entry-${index}`}
                  className={clsx("w-full rounded-(--spacing-3xs) px-xs py-3xs text-t text-text hover:bg-background/80")}
                >
                  {index + 1}-{log}
                </p>
              );
            })
          ) : (
            <p className="w-full px-xs py-3xs text-alt-text">
              {filteredLogs && filteredLogs.length > 0 ? "No logs matching your filter criteria" : "No logs for this container"}
            </p>
          )}
        </div>
        {!isAutoScroll && (
          <button
            className="absolute right-md bottom-md cursor-pointer rounded-full bg-primary p-xs shadow-sm shadow-dividers/10"
            onClick={() => {
              if (logsContainerRef.current) {
                logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
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
