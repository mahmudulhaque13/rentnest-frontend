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
