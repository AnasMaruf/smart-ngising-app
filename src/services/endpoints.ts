export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    REFRESH: "/api/auth/refresh",
  },
  BAB: {
    CREATE: "/api/bab-tracking",
  },
  STATS: {
    ROOT: "/api/stats",
  },
} as const;
