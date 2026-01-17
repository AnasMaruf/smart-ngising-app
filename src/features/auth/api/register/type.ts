export interface IAuthRegisterResponse {
    data: IAuthRegisterData;
}

export interface IAuthRegisterData {
    message: string;
    token: string;
    user: IUser;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_verified: boolean;
    gender: string | null;
    role: string | null;
}
