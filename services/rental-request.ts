import type {
  ICreateRentalRequest,
  IRentalRequest,
} from "@/types/rental-request.types";

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

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create rental request");
  }

  return result;
};

export const getMyRentalRequests = async (
  accessToken: string,
): Promise<IRentalRequest[]> => {
  const response = await fetch(`${API_URL}/rental-requests/my-requests`, {
    method: "GET",
    headers: {
      Authorization: accessToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get rental requests");
  }

  return result.data;
};

export const cancelRentalRequest = async (
  requestId: string,
  accessToken: string,
) => {
  const response = await fetch(`${API_URL}/rental-requests/${requestId}`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to cancel rental request");
  }

  return result;
};
