"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  cancelRentalRequest,
  getMyRentalRequests,
} from "@/services/rental-request";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import type {
  IRentalRequest,
  RentalRequestStatus,
} from "@/types/rental-request.types";

const statusStyles: Record<RentalRequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function RentalRequestsPage() {
  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<IRentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
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
        const result = await getMyRentalRequests(accessToken);

        setRequests(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load rental requests",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [user, authLoading]);

  const handleCancel = async (requestId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Please login again.");
      return;
    }

    setError("");
    setCancellingId(requestId);

    try {
      await cancelRentalRequest(requestId, accessToken);

      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to cancel rental request",
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Loading rental requests...
        </p>
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
              Please login to view your rental requests.
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
              Rental requests are available for tenants only.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Rental Requests</h1>

        <p className="mt-2 text-muted-foreground">
          Track the properties you have requested to rent.
        </p>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="py-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {requests.length === 0 && !error && (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No rental requests yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse properties and submit your first rental request.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse Properties
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {requests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <div className="relative h-52 w-full bg-muted">
              <Image
                src={request.property.images[0]}
                alt={request.property.title}
                fill
                className="object-cover"
              />
            </div>

            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    {request.property.title}
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.property.address}, {request.property.city}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[request.status]
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Monthly Rent
                </span>

                <span className="font-semibold">
                  ৳{request.property.rent.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Move-in Date
                </span>

                <span className="font-medium">
                  {new Date(request.moveInDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium">Your Message</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {request.message}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/properties/${request.property.id}`}
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  View Property
                </Link>

                {request.status === "PENDING" && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={cancellingId === request.id}
                    onClick={() => handleCancel(request.id)}
                  >
                    {cancellingId === request.id
                      ? "Cancelling..."
                      : "Cancel Request"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
