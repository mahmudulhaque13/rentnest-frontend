import type { IProperty, IPropertyResponse } from "@/types/property.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProperties = async (): Promise<IPropertyResponse> => {
  const response = await fetch(`${API_URL}/properties`);

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  return response.json();
};

export const getPropertyById = async (id: string): Promise<IProperty> => {
  const response = await fetch(`${API_URL}/properties/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  const result = await response.json();

  return result.data;
};

export const createProperty = async (
  payload: {
    title: string;
    description: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    address: string;
    city: string;
    district: string;
    images: string[];
    amenities?: string[];
    categoryId: string;
  },
  accessToken: string,
) => {
  const response = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create property");
  }

  return result;
};

export const getMyProperties = async (accessToken: string) => {
  const response = await fetch(`${API_URL}/properties/my-properties`, {
    headers: {
      Authorization: accessToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get your properties");
  }

  return result.data;
};

export const updateProperty = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    rent?: number;
    bedrooms?: number;
    bathrooms?: number;
    address?: string;
    city?: string;
    district?: string;
    images?: string[];
    amenities?: string[];
    categoryId?: string;
  },
  accessToken: string,
) => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update property");
  }

  return result.data;
};

export const deleteProperty = async (id: string, accessToken: string) => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete property");
  }

  return result.data;
};
