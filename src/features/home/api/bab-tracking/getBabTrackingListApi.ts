import { ENDPOINTS, useGetData } from "@/services";
import type { GetBabTrackingListResponse } from "./type";

export const BAB_TRACKING_LIST_QUERY_KEY = ["bab-tracking", "list"] as const;

export const useBabTrackingListQuery = () =>
  useGetData<GetBabTrackingListResponse>(BAB_TRACKING_LIST_QUERY_KEY, ENDPOINTS.BAB.CREATE, {
    requiresAuth: true,
  });
