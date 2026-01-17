export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  pin: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface IAuthRegisterResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}
