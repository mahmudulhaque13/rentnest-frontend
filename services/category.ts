import { ICategory } from "@/types/category.types";

const API_URL = "/api";

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get categories");
  }

  return result.data;
};
