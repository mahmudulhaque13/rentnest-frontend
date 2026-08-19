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

export const getLandlordRentalRequests = async (
  accessToken: string,
): Promise<IRentalRequest[]> => {
  const response = await fetch(`${API_URL}/rental-requests/landlord`, {
    method: "GET",
    headers: {
      Authorization: accessToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get landlord rental requests");
  }

  return result.data;
};

export const approveRentalRequest = async (
  requestId: string,
  accessToken: string,
) => {
  const response = await fetch(
    `${API_URL}/rental-requests/${requestId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to approve rental request");
  }

  return result;
};

export const rejectRentalRequest = async (
  requestId: string,
  accessToken: string,
) => {
  const response = await fetch(
    `${API_URL}/rental-requests/${requestId}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to reject rental request");
  }

  return result;
};
