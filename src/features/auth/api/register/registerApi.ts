import { ENDPOINTS, usePostFormData } from "@/services";
import type { RegisterRequest, IAuthRegisterResponse } from "./type";

export const useRegisterMutation = () => {
  return usePostFormData<RegisterRequest, IAuthRegisterResponse>(ENDPOINTS.AUTH.REGISTER);
};
