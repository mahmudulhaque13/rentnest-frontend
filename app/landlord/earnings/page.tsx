"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getLandlordEarnings,
  type ILandlordEarnings,
} from "@/services/payment";

import { RoleGuard } from "@/components/shared/role-guard";
import { Loading } from "@/components/shared/loading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function EarningsContent() {
  const [earnings, setEarnings] = useState<ILandlordEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEarnings = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        if (!cancelled) {
          setError("Please login again.");
          setLoading(false);
        }

        return;
      }

      try {
        const result = await getLandlordEarnings(accessToken);

        if (!cancelled) {
          setEarnings(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load earnings",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEarnings();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loading text="Loading earnings..." />
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

export default function LandlordEarningsPage() {
  return (
    <RoleGuard
      allowedRole="LANDLORD"
      loadingText="Checking landlord access..."
      accessMessage="Only landlords can view earnings."
    >
      <EarningsContent />
    </RoleGuard>
  );
}
