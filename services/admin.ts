import type { ICategory } from "@/types/category.types";

const API_URL = "/api";

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}

export interface IAdminProperty {
  id: string;
  title: string;
  description: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  district: string;
  images: string[];
  amenities: string[];
  status: "AVAILABLE" | "RENTED";
  averageRating: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  landlord: {
    id: string;
    name: string;
    email: string;
  };

  category: {
    id: string;
    name: string;
  };
}

export interface IAdminRentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  moveInDate: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;

  tenant: {
    id: string;
    name: string;
    email: string;
  };

  property: {
    id: string;
    title: string;
    rent: number;
    city: string;
    district: string;
  };
}

const getAuthHeaders = (accessToken: string) => ({
  Authorization: accessToken,
});

// ======================================================
// ADMIN USERS
// ======================================================

export const getAllAdminUsers = async (
  accessToken: string,
): Promise<IAdminUser[]> => {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: getAuthHeaders(accessToken),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load users");
  }

  return result.data;
};

export const updateAdminUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BLOCKED",
  accessToken: string,
): Promise<IAdminUser> => {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user status");
  }

  return result.data;
};

// ======================================================
// ADMIN PROPERTIES
// ======================================================

export const getAllAdminProperties = async (
  accessToken: string,
): Promise<IAdminProperty[]> => {
  const response = await fetch(`${API_URL}/admin/properties`, {
    headers: getAuthHeaders(accessToken),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load properties");
  }

  return result.data;
};

// ======================================================
// ADMIN RENTAL REQUESTS
// ======================================================

export const getAllAdminRentalRequests = async (
  accessToken: string,
): Promise<IAdminRentalRequest[]> => {
  const response = await fetch(`${API_URL}/admin/rental-requests`, {
    headers: getAuthHeaders(accessToken),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load rental requests");
  }

  return result.data;
};

// ======================================================
// CATEGORIES
// ======================================================

export const getAllCategories = async (
  accessToken: string,
): Promise<ICategory[]> => {
  const response = await fetch(`${API_URL}/categories`, {
    headers: getAuthHeaders(accessToken),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load categories");
  }

  return result.data;
};

export const createCategory = async (
  data: {
    name: string;
    slug: string;
  },
  accessToken: string,
): Promise<ICategory> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create category");
  }

  return result.data;
};

export const updateCategory = async (
  categoryId: string,
  data: {
    name: string;
    slug: string;
  },
  accessToken: string,
): Promise<ICategory> => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update category");
  }

  return result.data;
};

export const deleteCategory = async (
  categoryId: string,
  accessToken: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(accessToken),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete category");
  }
};
