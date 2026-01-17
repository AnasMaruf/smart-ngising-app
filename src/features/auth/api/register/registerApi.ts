import { ENDPOINTS, usePostFormData } from "@/services";
import type { IAuthRegisterResponse } from "./type";

export const useRegisterMutation = () => {
    return usePostFormData<FormData, IAuthRegisterResponse>(ENDPOINTS.AUTH.REGISTER);
};
