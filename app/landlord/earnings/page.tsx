"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getLandlordEarnings,
  type ILandlordEarnings,
} from "@/services/payment";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandlordEarningsPage() {
  const { user, loading: authLoading } = useAuth();

  const [earnings, setEarnings] = useState<ILandlordEarnings | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEarnings = async () => {
      if (authLoading) {
        return;
      }

      if (!user || user.role !== "LANDLORD") {
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
        const result = await getLandlordEarnings(accessToken);

        setEarnings(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load earnings",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading earnings...</p>
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
              Please login to view your earnings.
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

  if (user.role !== "LANDLORD") {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">Landlord access only</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Earnings are available for landlords only.
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
        <h1 className="text-3xl font-bold">Earnings</h1>

        <p className="mt-2 text-muted-foreground">
          View your rental payment earnings.
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

      {/* Statistics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              ৳{(earnings?.totalEarnings ?? 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payments
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{earnings?.totalPayments ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {!error && (!earnings || earnings.payments.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No earnings yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Paid rental payments will appear here.
            </p>

            <Link
              href="/landlord/properties"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              My Properties
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Payment List */}
      {earnings && earnings.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {earnings.payments.map((payment) => (
                <div key={payment.id} className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    {/* Property & Tenant */}
                    <div>
                      <h3 className="font-semibold">
                        {payment.rentalRequest.property.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {payment.rentalRequest.property.city},{" "}
                        {payment.rentalRequest.property.district}
                      </p>

                      <p className="mt-2 text-sm">
                        Tenant:{" "}
                        <span className="font-medium">
                          {payment.rentalRequest.tenant.name}
                        </span>
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {payment.rentalRequest.tenant.email}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold">
                        ৳{payment.amount.toLocaleString()}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {payment.status}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mt-4 grid gap-3 border-t pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">Provider</p>

                      <p className="font-medium">{payment.provider}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Paid Date</p>

                      <p className="font-medium">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Transaction ID</p>

                      <p className="break-all font-medium">
                        {payment.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
