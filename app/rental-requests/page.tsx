"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  cancelRentalRequest,
  getMyRentalRequests,
} from "@/services/rental-request";

import { createCheckoutSession } from "@/services/payment";

import { useAuth } from "@/components/providers/auth-provider";
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
  ACTIVE: "bg-blue-100 text-blue-700",
};

export default function RentalRequestsPage() {
  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<IRentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const loadRequests = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const result = await getMyRentalRequests(accessToken);

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

  const handleCancel = async (requestId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login again.");
      return;
    }

    setActionId(requestId);

    try {
      await cancelRentalRequest(requestId, accessToken);

      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId),
      );

      toast.success("Rental request cancelled successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel rental request";

      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  const handlePayment = async (requestId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login again.");
      return;
    }

    setActionId(requestId);

    try {
      const result = await createCheckoutSession(requestId, accessToken);

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      toast.error("Checkout URL was not returned.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start payment";

      toast.error(message);
      setActionId(null);
    }
  };

  // Authentication loading
  if (authLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loading text="Checking authentication..." />
      </main>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">
              Please login to view your rental requests.
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You need to be logged in to access your rental requests.
            </p>

            <Link href="/auth/login">
              <Button className="mt-5">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Rental request loading
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
        <h1 className="text-3xl font-bold">My Rental Requests</h1>

        <p className="mt-2 text-muted-foreground">
          Track your rental requests and payment status.
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
              You have not created any rental requests yet.
            </p>

            <Link href="/properties">
              <Button className="mt-5">Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => {
            const isProcessing = actionId === request.id;

            /*
             * Payment status has priority.
             *
             * This handles both:
             *
             * ACTIVE + PAID
             *
             * and old records:
             *
             * APPROVED + PAID
             */
            const isPaid = request.payment?.status === "PAID";

            const displayStatus = isPaid ? "ACTIVE" : request.status;

            return (
              <Card key={request.id} className="overflow-hidden">
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

                    {/* Status */}
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        isPaid
                          ? "bg-blue-100 text-blue-700"
                          : statusStyles[request.status]
                      }`}
                    >
                      {displayStatus}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Property Information */}
                  <div className="grid gap-4 border-b pb-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Monthly Rent
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        ৳{request.property.rent.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Move-in Date
                      </p>

                      <p className="mt-1 font-medium">
                        {request.moveInDate
                          ? new Date(request.moveInDate).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>

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

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Payment
                      </p>

                      <p className="mt-1 font-medium">
                        {request.payment?.status || "Not started"}
                      </p>
                    </div>
                  </div>

                  {/* Landlord Information */}
                  <div>
                    <p className="text-sm font-medium">Landlord</p>

                    <p className="mt-1 font-medium">
                      {request.property.landlord?.name || "Unknown landlord"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.property.landlord?.email || "No email available"}
                    </p>

                    {request.property.landlord?.phone && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.property.landlord.phone}
                      </p>
                    )}
                  </div>

                  {/* Tenant Message */}
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm font-medium">Your Message</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.message || "No message provided."}
                    </p>
                  </div>

                  {/* PENDING */}
                  {request.status === "PENDING" && (
                    <div className="space-y-4">
                      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-sm font-medium text-yellow-700">
                          Request Pending
                        </p>

                        <p className="mt-1 text-sm text-yellow-600">
                          Your rental request is waiting for the landlord&apos;s
                          approval.
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        disabled={isProcessing}
                        onClick={() => handleCancel(request.id)}
                      >
                        {isProcessing ? "Cancelling..." : "Cancel Request"}
                      </Button>
                    </div>
                  )}

                  {/* APPROVED + PAYMENT PENDING */}
                  {request.status === "APPROVED" && !isPaid && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">
                            Request Approved
                          </p>

                          <p className="mt-1 text-sm text-green-600">
                            Your request has been approved. Complete the payment
                            to activate the rental.
                          </p>
                        </div>

                        <Button
                          disabled={isProcessing}
                          onClick={() => handlePayment(request.id)}
                        >
                          {isProcessing ? "Processing..." : "Pay Now"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PAYMENT COMPLETED */}
                  {isPaid && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-700">
                        Payment Completed
                      </p>

                      <p className="mt-1 text-sm text-blue-600">
                        Your payment has been completed and this rental is now
                        active.
                      </p>
                    </div>
                  )}

                  {/* REJECTED */}
                  {request.status === "REJECTED" && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-700">
                        Request Rejected
                      </p>

                      <p className="mt-1 text-sm text-red-600">
                        Your rental request has been rejected by the landlord.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
