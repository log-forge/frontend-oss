import type { Route } from "./+types/home";
import { useNavigate, useNavigation } from "react-router";
import DefaultButton from "~/components/components library/button/DefaultButton";
import { TiWarning } from "react-icons/ti";
import { invalidateContainerAlerts,  type IAlert, type IContainer } from "~/utils/tanstack/queries/containerQueries";
import { useQueryStatus } from "~/utils/tanstack/states/queryStates";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosClient from "~/utils/axiosClient";
import EditKeywords from "~/components/modal/modals/EditKeywords";
import { useModal } from "~/context/ModalContext";

export default function Home({}: Route.ComponentProps) {
  const nav = useNavigation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { isPending, isError, data: containers = {}, error } = useQueryStatus<Record<string, IContainer>>(["containers"]);
  const { isPending: isAlertsPernding, isError: isAlertsError, data: alerts = [], error: alertsError } = useQueryStatus<IAlert[]>(["alerts"]);

  const [clearingAlerts, setClearingAlerts] = useState(false);

  useEffect(() => {
    console.log("containers:", containers);
    console.log("alerts:", alerts);
  }, [isPending, isAlertsPernding]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "running":
        return "bg-success/30 border border-success text-success";
      case "stopped":
        return "bg-error/30 border border-error text-error";
      case "restarting":
        return "bg-accent/30 border border-accent text-accent";
      case "paused":
        return "bg-primary/30 border border-primary text-primary";
      default:
        return "bg-alt-text/30 border border-alt-text text-alt-text";
    }
  };

  const handleClearAlerts = async () => {
    setClearingAlerts(true);

    const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
    const _t0 = `${Date.now().toString()} clear_alerts`;
    console.time(_t0);
    const { status, data } = await axiosClient.get(`${baseURL}/clear_alerts`);
    console.timeEnd(_t0);
    if (status != 200) throw new Response("Failed to clear alerts");

    invalidateContainerAlerts(queryClient);
    setClearingAlerts(false);
  };

  const invalidateAlerts = () => {
    invalidateContainerAlerts(queryClient);
    setTimeout(() => {
      invalidateContainerAlerts(queryClient);
    }, 4000); // wait for 1 second before invalidating alerts
  };

  if (isPending) return <div className="flex w-full max-w-5xl items-start justify-start p-md text-h2 text-text">Loading containers...</div>;
  if (isError || isAlertsError)
    return (
      <div className="flex w-full max-w-5xl flex-col items-start justify-start p-md text-h4 text-error-600 dark:text-error-300">
        <span>{error instanceof Error ? error.message : "Error loading containers"}</span>
        <span>{alertsError instanceof Error ? alertsError.message : "Error loading alerts"}</span>
      </div>
    );

  return (
    <div className="home-container w-full max-w-5xl p-md text-text">
      <h1 className="mb-md text-h2 font-bold">Docker Containers</h1>

      {/* Tool Bar */}
      <div className="mb-md flex w-full flex-row items-start justify-start gap-xs rounded-(--spacing-3xs) bg-middleground p-3xs px-sm text-text">
        <DefaultButton
          {...{
            onClick: () => {
              openModal(<EditKeywords invalidateAlerts={invalidateAlerts} />, "static_md");
            },
            color: "accent",
            radius: "3xs",
            slim: true,
          }}
        >
          <div className="text-t text-text">Edit Alert Key-Words</div>
        </DefaultButton>
        |
        <DefaultButton
          {...{
            disabled: isAlertsError || isAlertsPernding || clearingAlerts,
            loading: isAlertsPernding || clearingAlerts,
            onClick: handleClearAlerts,
            radius: "3xs",
            slim: true,
            customTailwind: "",
            color: "error",
          }}
        >
          <span className="text-t">Clear Alerts</span>
        </DefaultButton>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
        {/* sort the keys alphabetically */}
        {Object.entries(containers).map(([key, container], i) => (
          <div
            key={`container-${key}-${i}`}
            className="relative w-full cursor-pointer overflow-hidden rounded-(--spacing-sm) border border-dividers/20 bg-foreground shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/containers/${key}`);
            }}
          >
            {/* Tags */}
            <div className="flex flex-row items-center justify-start gap-2xs p-xs">
              {/* Status */}
              <span
                className={`flex w-fit items-center justify-start rounded-full px-xs py-4xs text-t font-medium ${getStatusColor(container.status || "none")}`}
              >
                {container.status}
              </span>
              {/* Warning icon - clickable */}
              {Array.isArray(alerts) && alerts?.some((alert) => alert.container === key) && (
                <DefaultButton
                  disabled={isAlertsError}
                  loading={isAlertsPernding}
                  stretch="fit"
                  color="warning"
                  padding={["xs", "4xs"]}
                  radius="full"
                  customTailwind={`!bg-warning/30 border border-warning !border-solid !shadow-none`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/containers/${key}/alerts`);
                  }}
                >
                  <span className="flex w-fit flex-row items-center justify-start gap-3xs text-t font-medium text-warning-500 dark:text-warning-300">
                    {isAlertsPernding ? "......" : "warning"}
                    <TiWarning className="text-warning-500 dark:text-warning-300" />
                  </span>
                </DefaultButton>
              )}
            </div>
            {/* Container Details */}
            <div className="mb-sm flex w-full flex-col items-start justify-start gap-xs px-xs">
              <h2 className="w-full truncate text-h5 font-bold">{key}</h2>
              <div className="flex w-full justify-between text-t">
                <span className="w-fit min-w-[max-content] text-left text-alt-text">Image:</span>
                <span className="text-right text-text">{container.image}</span>
              </div>
              <div className="flex w-full justify-between text-t">
                <span className="w-fit min-w-[max-content] text-left text-alt-text">ID:</span>
                <span className="text-right text-text">{container.container_id?.slice(0, 12)}</span>
              </div>
              <div className="flex w-full justify-between text-t">
                <span className="w-fit min-w-[max-content] text-left text-alt-text">Started At:</span>
                <span className="text-right text-text">{container.started_at ? new Date(container.started_at).toLocaleString() : "N/A"}</span>
              </div>
              {/* <div className="flex w-full justify-between text-t">
                <span className="w-fit min-w-[max-content] text-left text-alt-text">CPU:</span>
                <span className="text-right text-text">{container.cpu}</span>
              </div>
              <div className="flex w-full justify-between text-right text-t">
                <span className="w-fit min-w-[max-content] text-left text-alt-text">Memory:</span>
                <span className="text-right text-text">{container.memory}</span>
              </div> */}
            </div>
            {/* Actions */}
            {/* <div className="mt-auto grid grid-cols-2 gap-2xs bg-primary px-2xs py-2xs">
              <DefaultButton stretch="full" variant="text" color="accent" padding="2xs">
                <div className="text-t group-hover:font-bold">Restart</div>
              </DefaultButton>

              {container.status === "running" ? (
                <DefaultButton stretch="full" variant="text" color="error" padding="2xs">
                  <div className="text-t group-hover:font-bold">Stop</div>
                </DefaultButton>
              ) : (
                <DefaultButton stretch="full" variant="text" color="success" padding="2xs">
                  <div className="text-t group-hover:font-bold">Start</div>
                </DefaultButton>
              )}
            </div> */}
          </div>
        ))}
      </div>

      {Object.values(containers).length === 0 && (
        <div className="rounded-(--spacing-sm) bg-foreground p-xl text-center">
          <p className="text-p">No containers found</p>
        </div>
      )}
    </div>
  );
}
