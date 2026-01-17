export interface IAuthLoginResponse {
  data: string;
}

export interface IAuthErrorResponse {
  message: string;
  errors: {
    email?: string[];
    pin?: string[];
    [key: string]: string[] | undefined;
  };
}
