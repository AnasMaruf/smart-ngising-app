import type { User } from "../register/type";

export interface LoginRequest {
  email?: string;
  username?: string;
  pin: string;
}

export interface IAuthLoginResponse {
  data: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface IAuthErrorResponse {
  message: string;
  errors: {
    email?: string[];
    pin?: string[];
    [key: string]: string[] | undefined;
  };
}
