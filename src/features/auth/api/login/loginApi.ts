import { ENDPOINTS, usePostFormData } from "@/services";
import type { IAuthLoginResponse, LoginRequest } from "./type";

export const useLoginMutation = () => {
  return usePostFormData<LoginRequest, IAuthLoginResponse>(ENDPOINTS.AUTH.LOGIN);
};
