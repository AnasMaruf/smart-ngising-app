import { ENDPOINTS, usePostFormData } from "@/services";
import type { CreateBabTrackingRequest, CreateBabTrackingResponse } from "./type";

export const useCreateBabTrackingMutation = () =>
  usePostFormData<CreateBabTrackingRequest, CreateBabTrackingResponse>(ENDPOINTS.BAB.CREATE, {
    requiresAuth: true,
  });
