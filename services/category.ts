import { ICategory } from "@/types/category.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await fetch(`${API_URL}/categories`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get categories");
  }

  return result.data;
};
