export type UserRole = "TENANT" | "LANDLORD";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}
