import type { Route } from "./+types/containers.$id.logs";
import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { data } from "react-router";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import { getContainerLogs, invalidateContainerLogs, type IAlert, type IContainer } from "~/utils/tanstack/queries/containerQueries";
import { DeafultDropDown, DefaultDivider, DropDownItem } from "~/components/components library/dropdown/DefaultDropDown";
import DefaultButton from "~/components/components library/button/DefaultButton";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { flushSync } from "react-dom";
import { useQueryStatus } from "~/utils/tanstack/states/queryStates";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const logs = await getContainerLogs(params.id, 100);
    return data({ logs }, { status: 200 });
  } catch (error) {
    console.error("Error loading container logs:", error);
    return data({ logs: [] }, { status: 400 });
  }
}

export default function ContainerIdLogs({ loaderData, params }: Route.ComponentProps) {
  const { logs: fetchedLogs } = loaderData;
  const { id } = params;
  const queryClient = useQueryClient();

  const { data: containers = {} } = useQueryStatus<Record<string, IContainer>>(["containers"]);
  const { data: alerts = [] } = useQueryStatus<IAlert[]>(["alerts"]);

  const [filter, setFilter] = useState({ text: "", tail: 100 });
  const [filteredLogs, setFilteredLogs] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>(fetchedLogs);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "open" | "error" | "closed">("connecting");
  const isError = connectionStatus === "error";
  const isPending = connectionStatus === "connecting";

  useEffect(() => {
    console.log("id:", id);
    console.log("container:", containers);
    console.log("alerts:", alerts);
  }, [containers, alerts]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${window.location.host}/logs/${id}`);
    ws.onopen = () => {
      console.log(`[Logs] WebSocket connected for container ${id}`);
      setConnectionStatus("open");
    };
    ws.onerror = (err) => {
      console.error(`[Logs] WebSocket error:`, err);
      setConnectionStatus("error");
    };
    ws.onclose = (event) => {
      console.log(`[Logs] WebSocket closed:`, event);
      setConnectionStatus("closed");
    };
    let msgCount = 0;
    ws.onmessage = (event) => {
      msgCount++;
      console.log(`[Logs] Received message #${msgCount}:`, event.data);
      setLogs((prev) => [...prev, event.data]);
    };
    return () => ws.close();
  }, [id, fetchedLogs]);

  // derive filtered logs whenever logs or filter.text changes
  useEffect(() => {
    setFilteredLogs(logs?.filter((entry) => entry.includes(filter.text)) || []);
  }, [logs, filter.text, filter.tail]);

  return (
    <>
      <p className="text-xs">WS status: {connectionStatus}</p>
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
          <DeafultDropDown
            renderTrigger={(triggerRef, toggleDropdown, dropDownState, triggerAttributes, triggerUpdatePosition) => (
              <DefaultButton
                {...{
                  ref: triggerRef as React.Ref<HTMLButtonElement>,
                  type: "button",
                  disabled: isError,
                  loading: isPending,
                  onClick: toggleDropdown,
                  stretch: "fit",
                  padding: "3xs",
                  radius: "3xs",
                  customTailwind: "h-full max-h-full text-s !justify-start",
                  slim: true,
                  attributes: { ...triggerAttributes },
                }}
              >
                <div className="relative flex flex-row items-center justify-start text-s">
                  {/* invisible placeholder to lock in width */}
                  <div className="flex w-full flex-row items-center justify-start">
                    <div className="relative flex min-w-[max-content] flex-row items-center justify-center">
                      <span className="invisible">Choose a tail</span>
                      <span className="absolute flex w-full flex-row items-center justify-center">{filter.tail ? filter.tail : "Choose a tail"}</span>
                    </div>
                    <span className="ml-2xs">{dropDownState.isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                  </div>
                </div>
              </DefaultButton>
            )}
            renderOptions={[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((tail, index) => {
              return (key, toggleDropdown, dropDownState, optionProps) => {
                if (tail === -1) return <DefaultDivider key={`${key}-${index}`} />;
                else if (tail === 0)
                  return (
                    <DefaultInput
                      key={`${key}-${index}`}
                      {...{
                        type: "number",
                        disabled: isError,
                        loading: isPending,
                        value: filter.tail,
                        onChange: (e) => setFilter((prev) => ({ ...prev, tail: Number(e.target.value) })),
                        onSubmit: (e) => {
                          toggleDropdown();
                          // synchronously update filter.tail
                          // flushSync(() => setFilter((prev) => ({ ...prev, tail })));
                          setFilter((prev) => ({ ...prev, tail }));
                        },
                        attributes: { placeholder: "", name: "tail" },
                        stretch: "full",
                        radius: "3xs",
                        slim: true,
                        textSize: "s",
                        customTailwind: "h-full text-center",
                      }}
                    />
                  );
                else
                  return (
                    <DropDownItem
                      key={`${key}-${index}`}
                      {...{
                        disabled: isError,
                        loading: isPending,
                        onClick: () => {
                          toggleDropdown();
                          // synchronously update filter.tail
                          // flushSync(() => setFilter((prev) => ({ ...prev, tail })));
                          setFilter((prev) => ({ ...prev, tail }));
                        },
                        padding: ["3xs", "3xs"],
                        radius: "3xs",
                        slim: true,
                        ...optionProps,
                      }}
                    >
                      <div className="flex w-full items-center justify-center gap-sm text-s">{tail}</div>
                    </DropDownItem>
                  );
              };
            })}
            onDropDownClose={() => {
              console.log("New tail:", filter.tail);
              console.log("Refetching logs with new tail:", id);
              flushSync(() => {});
              invalidateContainerLogs(queryClient, id);
            }}
            uniqueKey="tail-dropdown"
            menuStretch="full"
            position="bottom"
            gap="3xs"
            radius={"3xs"}
            insetPercentage={10}
            optionProps={{ slim: true }}
          />
        </div>
        {/* Logs */}
        <div
          key={`logs-container-${filter.tail}`}
          className="flex h-full min-h-0 flex-col items-start justify-start rounded-(--spacing-2xs) border border-dividers/10 bg-foreground p-xs text-text shadow-lg shadow-dividers/20"
        >
          <div key={`logs-${filter.tail}`} className="flex h-full w-full flex-col items-start justify-start [overflow:overlay]">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => {
                return (
                  <p
                    key={`log-entry-${index}-${filter.tail}`}
                    className={clsx("w-full rounded-(--spacing-3xs) px-xs py-3xs text-t text-text hover:bg-background/80")}
                  >
                    {index + 1}-{log}
                  </p>
                );
              })
            ) : (
              <p className="w-full px-xs py-3xs text-alt-text">
                {logs && logs.length > 0 ? "No logs matching your filter criteria" : "No logs for this container"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
