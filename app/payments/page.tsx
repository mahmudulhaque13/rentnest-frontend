"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getMyPayments } from "@/services/payment";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { IPayment } from "@/services/payment";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

export default function MyPaymentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      if (authLoading) {
        return;
      }

      if (!user || user.role !== "TENANT") {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      try {
        const result = await getMyPayments(accessToken);

        setPayments(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load payments",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading payments...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">Login required</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please login to view your payments.
            </p>

            <Link
              href="/auth/login"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (user.role !== "TENANT") {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">Tenant access only</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Payment history is available for tenants only.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Payments</h1>

        <p className="mt-2 text-muted-foreground">
          View your rental payment history.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6">
          <CardContent className="py-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {payments.length === 0 && !error && (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No payments yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Your payment history will appear here.
            </p>

            <Link
              href="/rental-requests"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View Rental Requests
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      <div className="grid gap-6 md:grid-cols-2">
        {payments.map((payment) => {
          const property = payment.rentalRequest.property;

          return (
            <Card key={payment.id} className="overflow-hidden">
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden bg-muted">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{property.title}</CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.city}, {property.district}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[payment.status]
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>

                  <span className="text-lg font-bold">
                    ৳{payment.amount.toLocaleString()}
                  </span>
                </div>

                {/* Provider */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Provider
                  </span>

                  <span className="font-medium">{payment.provider}</span>
                </div>

                {/* Transaction */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Transaction ID
                  </p>

                  <p className="mt-1 break-all text-xs font-medium">
                    {payment.transactionId}
                  </p>
                </div>

                {/* Paid Date */}
                {payment.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Paid Date
                    </span>

                    <span className="text-sm font-medium">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Payment Created
                  </span>

                  <span className="text-sm font-medium">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Property Link */}
                <Link
                  href={`/properties/${property.id}`}
                  className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  View Property
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
