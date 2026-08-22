"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAllAdminProperties, type IAdminProperty } from "@/services/admin";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPropertiesPage() {
  const { user, loading: authLoading } = useAuth();

  const [properties, setProperties] = useState<IAdminProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user || user.role !== "ADMIN") {
      return;
    }

    const loadProperties = async () => {
      setLoading(true);
      setError("");

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        const message = "Please login again.";

        setError(message);
        toast.error(message);
        setLoading(false);

        return;
      }

      try {
        const result = await getAllAdminProperties(accessToken);

        setProperties(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load properties";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void loadProperties();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />

          <div className="h-12 animate-pulse rounded bg-muted" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <CardContent className="space-y-4 py-6">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />

                  <div className="h-20 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Property Management</h1>

        <p className="mt-2 text-muted-foreground">
          View and monitor all properties listed on RentNest.
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

      {/* Properties */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties ({properties.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {properties.length === 0 ? (
            <div className="py-12 text-center">
              <h2 className="text-lg font-semibold">No properties found</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                There are no properties available to manage.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Property</th>

                    <th className="px-4 py-3 font-medium">Landlord</th>

                    <th className="px-4 py-3 font-medium">Category</th>

                    <th className="px-4 py-3 font-medium">Location</th>

                    <th className="px-4 py-3 font-medium">Rent</th>

                    <th className="px-4 py-3 font-medium">Rating</th>

                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b last:border-0">
                      {/* Property */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{property.title}</p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {property.bedrooms} bed • {property.bathrooms} bath
                          </p>
                        </div>
                      </td>

                      {/* Landlord */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">
                            {property.landlord.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {property.landlord.email}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {property.category.name}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4">
                        <p>{property.city}</p>

                        <p className="text-xs text-muted-foreground">
                          {property.district}
                        </p>
                      </td>

                      {/* Rent */}
                      <td className="px-4 py-4 font-medium">
                        ৳{property.rent.toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          /month
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {property.averageRating.toFixed(1)}
                          </span>

                          <span className="text-yellow-500">★</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            property.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {property.status}
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
    </main>
  );
}
