import { useMutation, useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const resolveHostFromDebugger = () => {
  const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  if (!debuggerHost) return null;
  const [host] = debuggerHost.split(":");
  return host || null;
};

const host = resolveHostFromDebugger() ?? (Platform.OS === "android" ? "10.0.2.2" : "localhost");
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || `http://${host}:3000`;

type RequestOptions = {
  requiresAuth?: boolean;
};

async function request<TResponse>(
  url: string,
  init: RequestInit,
  options?: RequestOptions
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (options?.requiresAuth) {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      throw new Error("Access token not found");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...init,
    headers,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.errors || json.message || "Request failed");
  return json;
}

export function usePostFormData<TData, TResponse>(endpoint: string, options?: RequestOptions) {
  return useMutation({
    mutationFn: (data: TData) =>
      request<TResponse>(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        options
      ),
  });
}

export function useGetData<TResponse>(
  queryKey: QueryKey,
  endpoint: string,
  options?: RequestOptions
) {
  return useQuery({
    queryKey,
    queryFn: () =>
      request<TResponse>(
        endpoint,
        {
          method: "GET",
        },
        options
      ),
  });
}
