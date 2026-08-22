"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  approveRentalRequest,
  getLandlordRentalRequests,
  rejectRentalRequest,
} from "@/services/rental-request";

import { RoleGuard } from "@/components/shared/role-guard";
import { Loading } from "@/components/shared/loading";

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

function LandlordRentalRequestsContent() {
  const [requests, setRequests] = useState<IRentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRequests = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        if (!cancelled) {
          const message = "Please login again.";

          setError(message);
          toast.error(message);
          setLoading(false);
        }

        return;
      }

      try {
        const result = await getLandlordRentalRequests(accessToken);

        if (!cancelled) {
          setRequests(result);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load rental requests";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, []);

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

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loading text="Loading rental requests..." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rental Requests</h1>

        <p className="mt-2 text-muted-foreground">
          Review and manage requests from tenants.
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
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No rental requests found</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no rental requests for your properties.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => {
            const isProcessing = actionId === request.id;

            return (
              <Card key={request.id} className="overflow-hidden">
                <div className="grid lg:grid-cols-[280px_1fr]">
                  {/* Property Image */}
                  <div className="relative h-56 w-full bg-muted lg:h-full lg:min-h-[280px]">
                    {request.property.images?.[0] ? (
                      <Image
                        src={request.property.images[0]}
                        alt={request.property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <CardHeader>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {request.property.title}
                          </CardTitle>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {request.property.city}, {request.property.district}
                          </p>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                            statusStyles[request.status]
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      {/* Property Information */}
                      <div className="grid gap-4 border-b pb-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Monthly Rent */}
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Monthly Rent
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            ৳{request.property.rent.toLocaleString()}
                          </p>
                        </div>

                        {/* Move-in Date */}
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Move-in Date
                          </p>

                          <p className="mt-1 font-medium">
                            {request.moveInDate
                              ? new Date(
                                  request.moveInDate,
                                ).toLocaleDateString()
                              : "Not specified"}
                          </p>
                        </div>

                        {/* Requested On */}
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Requested On
                          </p>

                          <p className="mt-1 font-medium">
                            {request.createdAt
                              ? new Date(request.createdAt).toLocaleDateString()
                              : "Not available"}
                          </p>
                        </div>
                      </div>

                      {/* Tenant Information */}
                      <div>
                        <p className="text-sm font-medium">Tenant</p>

                        <p className="mt-1 font-medium">
                          {request.tenant?.name || "Unknown tenant"}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {request.tenant?.email || "No email available"}
                        </p>

                        {request.tenant?.phone && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {request.tenant.phone}
                          </p>
                        )}
                      </div>

                      {/* Tenant Message */}
                      <div className="rounded-md bg-muted/50 p-4">
                        <p className="text-sm font-medium">Tenant Message</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {request.message || "No message provided."}
                        </p>
                      </div>

                      {/* Actions */}
                      {request.status === "PENDING" && (
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button
                            className="flex-1"
                            disabled={isProcessing}
                            onClick={() => handleApprove(request.id)}
                          >
                            {isProcessing ? "Processing..." : "Approve"}
                          </Button>

                          <Button
                            variant="destructive"
                            className="flex-1"
                            disabled={isProcessing}
                            onClick={() => handleReject(request.id)}
                          >
                            {isProcessing ? "Processing..." : "Reject"}
                          </Button>
                        </div>
                      )}

                      {/* Approved Information */}
                      {request.status === "APPROVED" && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-4">
                          <p className="text-sm font-medium text-green-700">
                            Request Approved
                          </p>

                          <p className="mt-1 text-sm text-green-600">
                            The tenant can now proceed with payment.
                          </p>
                        </div>
                      )}

                      {/* Rejected Information */}
                      {request.status === "REJECTED" && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-4">
                          <p className="text-sm font-medium text-red-700">
                            Request Rejected
                          </p>

                          <p className="mt-1 text-sm text-red-600">
                            This rental request has been rejected.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function LandlordRentalRequestsPage() {
  return (
    <RoleGuard
      allowedRole="LANDLORD"
      loadingText="Checking landlord access..."
      accessMessage="Only landlords can manage rental requests."
    >
      <LandlordRentalRequestsContent />
    </RoleGuard>
  );
}
