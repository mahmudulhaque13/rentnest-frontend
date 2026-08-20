"use client";

import { useEffect, useState } from "react";

import {
  getAllAdminRentalRequests,
  type IAdminRentalRequest,
} from "@/services/admin";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusStyles: Record<IAdminRentalRequest["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

export default function AdminRentalRequestsPage() {
  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<IAdminRentalRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user || user.role !== "ADMIN") {
      return;
    }

    const loadRentalRequests = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return;
      }

      try {
        const result = await getAllAdminRentalRequests(accessToken);

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

    void loadRentalRequests();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />

          <div className="h-12 animate-pulse rounded bg-muted" />

          <div className="h-72 animate-pulse rounded bg-muted" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="text-xl font-semibold">Login required</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please login as an admin.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="text-xl font-semibold">Admin access only</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              You are not authorized to access this page.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "REJECTED",
  ).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rental Request Management</h1>

        <p className="mt-2 text-muted-foreground">
          View and monitor all rental requests submitted by tenants.
        </p>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="py-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests */}
      <Card>
        <CardHeader>
          <CardTitle>All Rental Requests ({requests.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {requests.length === 0 ? (
            <div className="py-12 text-center">
              <h2 className="text-lg font-semibold">
                No rental requests found
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                There are currently no rental requests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="rounded-lg border p-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    {/* Property */}
                    <div className="min-w-0">
                      <p className="text-lg font-semibold">
                        {request.property.title}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.property.city}, {request.property.district}
                      </p>

                      <p className="mt-2 font-medium">
                        ৳{request.property.rent.toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[request.status]}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Tenant */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Tenant
                      </p>

                      <p className="mt-1 font-medium">{request.tenant.name}</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.tenant.email}
                      </p>
                    </div>

                    {/* Move-in Date */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Move-in Date
                      </p>

                      <p className="mt-1 font-medium">
                        {new Date(request.moveInDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Created */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Requested On
                      </p>

                      <p className="mt-1 font-medium">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Request ID */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Request ID
                      </p>

                      <p className="mt-1 truncate font-mono text-xs">
                        {request.id}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="mt-5 rounded-md bg-muted/50 p-4">
                      <p className="text-sm font-medium">Tenant Message</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
