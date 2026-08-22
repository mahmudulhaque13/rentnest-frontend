"use client";

import { useEffect, useState } from "react";

import {
  getAllAdminProperties,
  getAllAdminRentalRequests,
  getAllAdminUsers,
  type IAdminProperty,
  type IAdminRentalRequest,
  type IAdminUser,
} from "@/services/admin";

import { toast } from "sonner";

import { RoleGuard } from "@/components/shared/role-guard";
import { Loading } from "@/components/shared/loading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminDashboardContent() {
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [properties, setProperties] = useState<IAdminProperty[]>([]);
  const [rentalRequests, setRentalRequests] = useState<IAdminRentalRequest[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAdminData = async () => {
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
        const [usersResult, propertiesResult, rentalRequestsResult] =
          await Promise.all([
            getAllAdminUsers(accessToken),
            getAllAdminProperties(accessToken),
            getAllAdminRentalRequests(accessToken),
          ]);

        if (cancelled) return;

        setUsers(usersResult);
        setProperties(propertiesResult);
        setRentalRequests(rentalRequestsResult);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load admin dashboard";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAdminData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loading text="Loading admin dashboard..." />
      </main>
    );
  }

  const tenantCount = users.filter((item) => item.role === "TENANT").length;

  const landlordCount = users.filter((item) => item.role === "LANDLORD").length;

  const pendingCount = rentalRequests.filter(
    (item) => item.status === "PENDING",
  ).length;

  const approvedCount = rentalRequests.filter(
    (item) => item.status === "APPROVED",
  ).length;

  const rentedPropertiesCount = properties.filter(
    (item) => item.status === "RENTED",
  ).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Manage users, properties, and rental requests.
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

      {/* Main Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{users.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tenants
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{tenantCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Landlords
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{landlordCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{properties.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rental Statistics */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rental Requests
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{rentalRequests.length}</p>
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
              Rented Properties
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{rentedPropertiesCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">Role</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {users.slice(0, 5).map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-3 py-3">{item.name}</td>

                      <td className="px-3 py-3 text-muted-foreground">
                        {item.email}
                      </td>

                      <td className="px-3 py-3">{item.role}</td>

                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Rental Requests */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Rental Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {rentalRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No rental requests found.
            </p>
          ) : (
            <div className="space-y-4">
              {rentalRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-medium">{request.property.title}</p>

                    <p className="text-sm text-muted-foreground">
                      {request.tenant.name} • {request.tenant.email}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      request.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : request.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : request.status === "CANCELLED"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
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
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleGuard
      allowedRole="ADMIN"
      loadingText="Checking admin access..."
      accessMessage="You are not authorized to access this page."
    >
      <AdminDashboardContent />
    </RoleGuard>
  );
}
