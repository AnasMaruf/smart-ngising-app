import { ENDPOINTS, usePostFormData } from "@/services";
import type { IAuthLoginResponse } from "./type";

export const useLoginMutation = () => {
    return usePostFormData<FormData, IAuthLoginResponse>(ENDPOINTS.AUTH.LOGIN);
};
