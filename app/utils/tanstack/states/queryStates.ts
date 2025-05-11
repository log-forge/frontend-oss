import { useQueryClient } from "@tanstack/react-query";
import type { IContainer } from "../queries/containerQueries";
import { useSyncExternalStore } from "react";

export function useQueryStatus<T = unknown>(queryKey: unknown[]) {
  const queryClient = useQueryClient();
  // subscribe to any change in the query cache
  const state = useSyncExternalStore(
    // subscribe
    (onStoreChange) => queryClient.getQueryCache().subscribe(onStoreChange),
    // get current snapshot
    () => queryClient.getQueryState(queryKey),
    // server snapshot (same)
    () => queryClient.getQueryState(queryKey),
  );
  if (!state) return { isPending: false, isError: true, data: undefined, error: new Error("State does not exists for query keys") };

  return {
    isPending: state.status === "pending",
    isError: state.status === "error",
    data: queryClient.getQueryData<T | undefined>(queryKey),
    error: state.error ?? new Error("Something went wrong"),
  };
}

export function useContainersStatus() {
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState<Record<string, IContainer>>(["containers"]);

  if (!state) return { isPending: false, isError: true, data: {}, error: new Error("State does not exists for query keys") };
  return {
    isPending: state?.status === "pending",
    isError: state?.status === "error",
    data: queryClient.getQueryData<Record<string, IContainer>>(["containers"]) ?? {},
    error: state?.error ?? new Error("Something went wrong"),
  };
}
