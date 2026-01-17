import { useMutation } from "@tanstack/react-query";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";

async function postRequest<TData, TResponse>(url: string, data: TData): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.errors || json.message || "Request failed");
  return json;
}

export function usePostFormData<TData, TResponse>(endpoint: string) {
  return useMutation({
    mutationFn: (data: TData) => postRequest<TData, TResponse>(endpoint, data),
  });
}
