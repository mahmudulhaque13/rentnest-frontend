import type {
  IAuthResponse,
  ILoginUser,
  IRegisterUser,
} from "@/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (payload: IRegisterUser) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export const loginUser = async (
  payload: ILoginUser,
): Promise<IAuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const getMe = async (accessToken: string) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: accessToken,
    },
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get user profile");
  }

  return result;
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to refresh access token");
  }

  return result;
};

export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed");
  }

  return result;
};
