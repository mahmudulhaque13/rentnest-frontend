"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RoleGuard } from "@/components/shared/role-guard";
import { Loading } from "@/components/shared/loading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  getLandlordEarnings,
  type ILandlordEarnings,
} from "@/services/payment";

import { getMyProperties } from "@/services/property";

import { getLandlordRentalRequests } from "@/services/rental-request";

interface LandlordProperty {
  id: string;
  title: string;
  rent: number;
  city: string;
  district?: string;
  status?: string;
}

interface LandlordRentalRequest {
  id: string;
  status: string;
  property?: {
    id: string;
    title: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
}

function LandlordDashboardContent() {
  const [properties, setProperties] = useState<LandlordProperty[]>([]);
  const [requests, setRequests] = useState<LandlordRentalRequest[]>([]);
  const [earnings, setEarnings] = useState<ILandlordEarnings | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        if (!cancelled) {
          const message = "Please login again.";

          setError(message);
          setLoading(false);
          toast.error(message);
        }

        return;
      }

      try {
        const [propertyResult, requestResult, earningsResult] =
          await Promise.all([
            getMyProperties(accessToken),
            getLandlordRentalRequests(accessToken),
            getLandlordEarnings(accessToken),
          ]);

        if (cancelled) {
          return;
        }

        setProperties(propertyResult);
        setRequests(requestResult);
        setEarnings(earningsResult);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load landlord dashboard";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Loading text="Loading landlord dashboard..." />
      </main>
    );
  }

  const activeRequests = requests.filter(
    (request) => request.status === "PENDING" || request.status === "APPROVED",
  ).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-8">
        <p className="text-sm font-medium text-primary">RentNest</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Landlord Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your properties, rental requests, and earnings.
        </p>
      </section>

      {/* Error */}
      {error && (
        <Card className="mb-6">
          <CardContent className="py-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{properties.length}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Properties listed by you
            </p>
          </CardContent>
        </Card>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Requests
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{activeRequests}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Pending or approved requests
            </p>
          </CardContent>
        </Card>

        {/* Earnings */}
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

            <p className="mt-1 text-sm text-muted-foreground">
              From completed payments
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/landlord/properties/create"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Add Property
              </Link>

              <Link
                href="/landlord/properties"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Manage Properties
              </Link>

              <Link
                href="/landlord/rental-requests"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Rental Requests
              </Link>

              <Link
                href="/landlord/earnings"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Earnings
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Properties */}
      <section className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Properties</CardTitle>

            <Link
              href="/landlord/properties"
              className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View All
            </Link>
          </CardHeader>

          <CardContent>
            {properties.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  You have not listed any properties yet.
                </p>

                <Link
                  href="/landlord/properties/create"
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div
                    key={property.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{property.title}</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {property.city}
                        {property.district ? `, ${property.district}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-semibold">
                        ৳{Number(property.rent).toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>

                      {property.status && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            property.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {property.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Recent Rental Requests */}
      <section className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Rental Requests</CardTitle>

            <Link
              href="/landlord/rental-requests"
              className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View All
            </Link>
          </CardHeader>

          <CardContent>
            {requests.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No rental requests yet.
              </p>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {request.property?.title || "Property"}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.tenant?.name || "Tenant"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : request.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default function LandlordDashboardPage() {
  return (
    <RoleGuard
      allowedRole="LANDLORD"
      loadingText="Checking landlord access..."
      accessMessage="Only landlords can access this page."
    >
      <LandlordDashboardContent />
    </RoleGuard>
  );
}
