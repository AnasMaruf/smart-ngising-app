import { ENDPOINTS, useGetData } from "@/services";

import type { GetStatsResponse } from "./type";

export const STATS_QUERY_KEY = ["stats"] as const;

export const useStatsQuery = (range: string) =>
  useGetData<GetStatsResponse>(
    [...STATS_QUERY_KEY, range],
    `${ENDPOINTS.STATS.ROOT}?range=${encodeURIComponent(range)}`,
    { requiresAuth: true }
  );
