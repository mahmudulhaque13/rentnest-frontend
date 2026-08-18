import type { ICreateRentalRequest } from "@/types/rental-request.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createRentalRequest = async (
  payload: ICreateRentalRequest,
  accessToken: string,
) => {
  const response = await fetch(`${API_URL}/rental-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Failed to create rental request");
  }

  return response.json();
};
