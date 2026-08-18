export interface IPropertyLandlord {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface IPropertyCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProperty {
  id: string;
  title: string;
  slug: string;
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
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  averageRating: number;
  landlord: IPropertyLandlord;
  category: IPropertyCategory;
}

export interface IPropertyMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPropertyResponse {
  success: boolean;
  message: string;
  meta: IPropertyMeta;
  data: IProperty[];
}
