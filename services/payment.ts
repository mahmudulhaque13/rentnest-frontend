const API_URL = "/api";

export interface ICheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
}

export interface IPayment {
  id: string;
  amount: number;
  transactionId: string;
  paymentIntentId?: string | null;
  provider: string;
  status: "PENDING" | "PAID" | "FAILED";
  paidAt?: string | null;
  createdAt: string;

  rentalRequest: {
    id: string;

    property: {
      id: string;
      title: string;
      city: string;
      district: string;
      rent: number;
      images: string[];
    };
  };
}

export interface ILandlordEarnings {
  totalEarnings: number;
  totalPayments: number;

  payments: Array<
    IPayment & {
      rentalRequest: {
        id: string;

        tenant: {
          id: string;
          name: string;
          email: string;
        };

        property: {
          id: string;
          title: string;
          city: string;
          district: string;
          rent: number;
        };
      };
    }
  >;
}

export const createCheckoutSession = async (
  rentalRequestId: string,
  accessToken: string,
): Promise<ICheckoutResponse> => {
  const response = await fetch(`${API_URL}/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({
      rentalRequestId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create checkout session");
  }

  return result.data;
};

export const getMyPayments = async (
  accessToken: string,
): Promise<IPayment[]> => {
  const response = await fetch(`${API_URL}/payments/my-payments`, {
    headers: {
      Authorization: accessToken,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get payments");
  }

  return result.data;
};

export const getLandlordEarnings = async (
  accessToken: string,
): Promise<ILandlordEarnings> => {
  const response = await fetch(`${API_URL}/payments/earnings`, {
    headers: {
      Authorization: accessToken,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get earnings");
  }

  return result.data;
};
