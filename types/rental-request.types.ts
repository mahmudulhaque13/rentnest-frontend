export interface ICreateRentalRequest {
  propertyId: string;
  moveInDate: string;
  message: string;
}

export interface IRentalRequestCategory {
  id: string;
  name: string;
}

export interface IRentalRequestProperty {
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
  status: string;
  category?: IRentalRequestCategory;
}

export interface IRentalRequestTenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export type RentalRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IRentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  message: string;
  status: RentalRequestStatus;
  createdAt: string;
  updatedAt: string;
  property: IRentalRequestProperty;
  tenant?: IRentalRequestTenant;
}
