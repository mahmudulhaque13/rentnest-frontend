"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  approveRentalRequest,
  getLandlordRentalRequests,
  rejectRentalRequest,
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

export default function LandlordRentalRequestsPage() {
  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<IRentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      if (authLoading) {
        return;
      }

      if (!user || user.role !== "LANDLORD") {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        const message = "Please login again.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      try {
        const result = await getLandlordRentalRequests(accessToken);

        setRequests(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load rental requests";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void loadRequests();
  }, [user, authLoading]);

  const handleApprove = async (requestId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    setError("");
    setActionId(requestId);

    try {
      await approveRentalRequest(requestId, accessToken);

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "APPROVED",
                property: {
                  ...request.property,
                  status: "RENTED",
                },
              }
            : request,
        ),
      );

      toast.success("Rental request approved successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to approve rental request";

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    setError("");
    setActionId(requestId);

    try {
      await rejectRentalRequest(requestId, accessToken);

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "REJECTED",
              }
            : request,
        ),
      );

      toast.success("Rental request rejected successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to reject rental request";

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
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
              Please login as a landlord.
            </p>
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
              Only landlords can manage rental requests.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rental Requests</h1>

        <p className="mt-2 text-muted-foreground">
          Review and manage requests from tenants.
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
              Tenant rental requests will appear here.
            </p>
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
              <div>
                <p className="text-sm font-medium">Tenant</p>

                <div className="mt-1 text-sm text-muted-foreground">
                  <p>{request.tenant?.name}</p>
                  <p>{request.tenant?.email}</p>

                  {request.tenant?.phone && <p>{request.tenant.phone}</p>}
                </div>
              </div>

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
                <p className="text-sm font-medium">Tenant Message</p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {request.message || "No message provided."}
                </p>
              </div>

              {request.status === "PENDING" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    disabled={actionId === request.id}
                    onClick={() => handleApprove(request.id)}
                  >
                    {actionId === request.id ? "Processing..." : "Approve"}
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={actionId === request.id}
                    onClick={() => handleReject(request.id)}
                  >
                    {actionId === request.id ? "Processing..." : "Reject"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
