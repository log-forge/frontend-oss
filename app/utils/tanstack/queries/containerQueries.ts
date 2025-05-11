import { QueryClient } from "@tanstack/react-query";
import axiosClient from "~/utils/axiosClient";

export interface IContainer {
  container_id: string | null;
  status: string | null;
  log_path: string | null;
  image: string | null;
  ports: string[] | null;
  volumes: string[] | null;
  networks: string[] | null;
  started_at: string | null;
  uptime: string | null;
  command: string | null;
}

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.VITE_BACKEND_SERVICE_HOST}:${process.env.VITE_BACKEND_SERVICE_PORT}`
  : `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
console.log("Base URL:", baseURL);

export const getContainers = async () => {
  const _t0 = `${Date.now().toString()} containers`;
  console.time(_t0);
  console.log("Fetching containers...", baseURL);
  const { status, data } = await axiosClient.get(`${baseURL}/containers`);
  console.timeEnd(_t0);
  if (status != 200) throw new Response("Failed to fetch containers");
  // console.log("Containers data:", data);

  const containers: Record<string, IContainer> = data;
  return containers;
};

export function invalidateContainers(queryClient: QueryClient, exact: boolean = true) {
  queryClient.invalidateQueries({ queryKey: ["containers"], exact });
}

export interface IAlert {
  /** the container’s name */
  container: string;
  /** ISO‑8601 timestamp string */
  timestamp: string;
  /** the log message */
  message: string;
}

export const getContainerAlerts = async () => {
  const _t1 = `${Date.now().toString()} container alerts`;
  console.time(_t1);
  const { status, data } = await axiosClient.get(`${baseURL}/alerts`);
  console.timeEnd(_t1);
  if (status != 200) throw new Response("Failed to fetch alerts");
  // console.log("Alerts data:", data);

  const alerts: IAlert[] = data;
  return alerts;
};

export function invalidateContainerAlerts(queryClient: QueryClient, exact: boolean = true) {
  queryClient.invalidateQueries({ queryKey: ["alerts"], exact });
}

export const getContainerLogs = async (containerName: string, tail: number = 100) => {
  const _t2 = `${Date.now().toString()} container logs`;
  console.time(_t2);
  const { status, data } = await axiosClient.get(`${baseURL}/logs/${containerName}`, { params: { tail } });
  console.timeEnd(_t2);
  if (status != 200) throw new Response(`Failed to fetch last ${tail} logs for ${containerName}`);
  if (!("logs" in data) || typeof data.logs != "string") throw new Response(`Logs not found for ${containerName}`);
  // console.log("Logs data:", data);

  // split the raw logs string into an array of lines
  const lines: string[] = data.logs.split("\n").filter((line: string) => line.trim().length > 0) || [];
  console.log("Filtered logs length:", lines.length, "vs", data.logs.split("\n").length);
  return lines; // string[]
};

export function invalidateContainerLogs(queryClient: QueryClient, containerName: string = "", exact: boolean = true) {
  console.log("Invalidating logs query for container:", containerName);
  // Invalidate the logs query for the specific container or all containers if no name is provided
  if (containerName) {
    queryClient.invalidateQueries({ queryKey: ["logs", containerName], exact });
  } else queryClient.invalidateQueries({ queryKey: ["logs"], exact });
}

export const getContainerFilteredLogs = async (containerName: string, tail: number = 100) => {
  const _t3 = `${Date.now().toString()} container filtered logs`;
  console.time(_t3);
  const { status, data } = await axiosClient.get(`${baseURL}/logs/filter/${containerName}`, { params: { tail } });
  console.timeEnd(_t3);
  if (status != 200) throw new Response(`Failed to fetch last ${tail} logs for ${containerName}`);
  if (!("filtered_logs" in data) || typeof data.filtered_logs != "string") throw new Response(`Filtered logs not found for ${containerName}`);
  // console.log("Logs data:", data);

  // split the raw logs string into an array of lines
  const filteredLines: string[] = data.filtered_logs.split("\n").filter((line: string) => line.trim().length > 0) || [];
  console.log("Filtered logs length:", filteredLines.length);
  return filteredLines; // string[]
};

export function invalidateContainerFilteredLogs(queryClient: QueryClient, containerName: string = "", exact: boolean = true) {
  console.log("Invalidating filtered logs query for container:", containerName);
  // Invalidate the logs query for the specific container or all containers if no name is provided
  if (containerName) {
    queryClient.invalidateQueries({ queryKey: ["filteredLogs", containerName], exact });
  } else queryClient.invalidateQueries({ queryKey: ["filteredLogs"], exact });
}
