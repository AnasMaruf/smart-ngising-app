import { useMutation, useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { emitAuthEvent } from "@/contexts/authEvents";

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

const handleUnauthorized = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync("accessToken"),
    SecureStore.deleteItemAsync("refreshToken"),
    SecureStore.deleteItemAsync("user"),
  ]);
  emitAuthEvent("FORCE_LOGOUT");
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

  const response = await fetch(`${BASE_URL}${url}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && options?.requiresAuth) {
      await handleUnauthorized();
      throw new Error("Session expired. Please log in again.");
    }

    const errorDetails = payload?.errors;
    const message =
      (typeof errorDetails === "string" && errorDetails) ||
      payload?.message ||
      "Request failed";

    const error = new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    ) as Error & { details?: unknown };

    if (errorDetails && typeof errorDetails !== "string") {
      error.details = errorDetails;
    }

    throw error;
  }

  return payload as TResponse;
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
