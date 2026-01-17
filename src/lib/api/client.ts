const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";

export const api = {
  post: async <T>(path: string, body: object): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errors || data.message || "Request failed");
    }
    return data;
  },
};
