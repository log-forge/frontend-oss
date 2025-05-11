import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { TiWarning } from "react-icons/ti";
import DefaultButton from "~/components/components library/button/DefaultButton";
import type { IAlert, IContainer } from "~/utils/tanstack/queries/containerQueries";
import { useEffect } from "react";
import { useQueryStatus } from "~/utils/tanstack/states/queryStates";
import { IoMdSettings } from "react-icons/io";
import clsx from "clsx";
import { useModal } from "~/context/ModalContext";
import ContainerSettings from "~/components/modal/modals/container/settings/ContainerSettings";

export default function ContainersLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useModal();

  useEffect(() => {
    if (!id) navigate("/", { replace: true });
  }, []);

  const { data: containers = {} } = useQueryStatus<Record<string, IContainer>>(["containers"]);
  const container = id ? containers?.[id] : null;
  const { data: alerts = [] } = useQueryStatus<IAlert[]>(["alerts"]);

  const navOptions = [
    { to: "logs", title: "Logs" },
    { to: "alerts", title: "Alerts" },
  ];

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

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

  return (
    <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start justify-start">
      <header className="mt-sm flex w-full flex-col gap-xs rounded-(--spacing-3xs) bg-middleground p-sm text-text">
        {/* Container title and tags */}
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center justify-start gap-xs text-p font-bold text-text">
            {id ? id : "...."}
            <span
              className={`flex w-fit items-center justify-start rounded-full px-xs py-4xs text-t font-medium ${getStatusColor(container ? container.status! : "....")}`}
            >
              {container ? container.status : "...."}
            </span>
            {id && Array.isArray(alerts) && alerts?.some((alert) => alert.container === id) && (
              <DefaultButton
                stretch="fit"
                color="warning"
                padding={["xs", "4xs"]}
                radius="full"
                customTailwind={`!bg-warning/30 border border-warning !border-solid !shadow-none`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/containers/${id}/alerts`);
                }}
              >
                <span className="flex w-fit flex-row items-center justify-start gap-3xs text-t font-medium text-warning-500 dark:text-warning-300">
                  {!id ? "......" : "warning"}
                  <TiWarning className="text-warning-500 dark:text-warning-300" />
                </span>
              </DefaultButton>
            )}
          </div>
          {/* Actions */}
          {/* <div className="flex space-x-4">
            <DefaultButton stretch={"full"} variant="text" color="accent" padding="2xs">
              <div className={clsx("flex w-full flex-col items-center justify-start text-t group-hover:font-bold")}>
                Restart
                <div className="pointer-events-none h-0 font-bold text-transparent opacity-0 select-none" tabIndex={-1}>
                  {/* This is a hidden element to help with screen readers */}
          {/*Restart
                </div>
              </div>
            </DefaultButton>
            {container && container.status === "running" ? (
              <DefaultButton stretch={"full"} variant="text" color="error" padding="2xs">
                <div className={clsx("flex w-full flex-col items-center justify-start text-t group-hover:font-bold")}>
                  Stop
                  <div className="pointer-events-none h-0 font-bold text-transparent opacity-0 select-none" tabIndex={-1}>
                    {/* This is a hidden element to help with screen readers */}
          {/*Stop
                  </div>
                </div>
              </DefaultButton>
            ) : (
              <DefaultButton stretch={"full"} variant="text" color="success" padding="2xs">
                <div className={clsx("flex w-full flex-col items-center justify-start text-t group-hover:font-bold")}>
                  Start
                  <div className="pointer-events-none h-0 font-bold text-transparent opacity-0 select-none" tabIndex={-1}>
                    {/* This is a hidden element to help with screen readers */}
          {/*Start
                  </div>
                </div>
              </DefaultButton>
            )}
          </div> */}
        </div>
        {/* Container ID and image */}
        <div>
          <p className="text-t text-alt-text">ID: {container ? container.container_id : "...."}</p>
          <p className="text-t text-alt-text">Image: {container ? container.image : "...."}</p>
        </div>
      </header>
      <nav className="w-full border-b border-dividers/20 text-text">
        <ul className="flex flex-row items-end justify-start gap-md px-md pt-2xs">
          {navOptions.map((option, i) => (
            <li
              key={`container-nav-options-${option.to}-${i}`}
              className={clsx(
                "mt-auto h-fit",
                isActive(option.to) ? "border-b-2 border-dividers/40" : "border-b-2 border-transparent hover:border-dividers/40",
              )}
            >
              <Link to={`/containers/${id}/${option.to}`}>{option.title}</Link>
            </li>
          ))}

          <div className="ml-auto flex-row items-center justify-end">
            <DefaultButton
              {...{
                onClick: () => openModal(<ContainerSettings />, "static_lg"),
                stretch: "fit",
                variant: "text",
                padding: ["4xs", "4xs"],
                customTailwind: "!bg-transparent",
              }}
            >
              <div className="relative flex items-center justify-center">
                <IoMdSettings className={clsx("origin-center transition-all duration-500 group-hover:scale-120 group-hover:rotate-135")} />
              </div>
            </DefaultButton>
          </div>
        </ul>
      </nav>
      <main className="flex h-full min-h-0 w-full flex-col items-start justify-start px-md pt-2xs">
        <Outlet />
      </main>
    </div>
  );
}
