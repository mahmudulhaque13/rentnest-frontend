export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface ICreateRentalRequest {
  propertyId: string;
  moveInDate: string;
  message: string;
}

export interface IRentalRequestPayment {
  id: string;
  amount: number;
  transactionId: string;
  paymentIntentId: string | null;
  provider: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
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
  amenities: string[];
  status: string;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  averageRating: number;

  category?: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };

  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface IRentalRequestTenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface IRentalRequest {
  id: string;
  moveInDate: string;
  message: string;
  status: RentalRequestStatus;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;

  property: IRentalRequestProperty;

  tenant?: IRentalRequestTenant;

  payment?: IRentalRequestPayment | null;
}
