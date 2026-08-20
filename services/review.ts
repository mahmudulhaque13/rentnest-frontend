const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IReview {
  id: string;
  tenantId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}

export const getPropertyReviews = async (
  propertyId: string,
): Promise<IReview[]> => {
  const response = await fetch(`${API_URL}/reviews/property/${propertyId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get reviews");
  }

  return result.data;
};

export const createReview = async (
  payload: {
    propertyId: string;
    rating: number;
    comment: string;
  },
  accessToken: string,
): Promise<IReview> => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create review");
  }

  return result.data;
};

export const updateReview = async (
  reviewId: string,
  payload: {
    rating?: number;
    comment?: string;
  },
  accessToken: string,
): Promise<IReview> => {
  const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update review");
  }

  return result.data;
};

export const deleteReview = async (
  reviewId: string,
  accessToken: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete review");
  }
};
