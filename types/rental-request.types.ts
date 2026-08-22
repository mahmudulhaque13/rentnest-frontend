export type RentalRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ICreateRentalRequest {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export interface IRentalRequestPayment {
  id: string;
  amount: number;
  transactionId: string;
  paymentIntentId?: string | null;
  provider: string;
  status: "PENDING" | "PAID" | "FAILED";
  paidAt?: string | null;
  createdAt: string;
}

export interface IRentalRequestTenant {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface IRentalRequestProperty {
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
  status: string;
  averageRating: number;

  category: {
    id: string;
    name: string;
  };

  landlord: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface IRentalRequest {
  id: string;
  moveInDate: string;
  message: string | null;
  status: RentalRequestStatus;

  tenantId: string;

  tenant?: IRentalRequestTenant;

  propertyId: string;

  property: IRentalRequestProperty;

  payment?: IRentalRequestPayment | null;

  createdAt?: string;
  updatedAt?: string;
}
