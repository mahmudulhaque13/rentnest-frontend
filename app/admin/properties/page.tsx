"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAllAdminProperties, type IAdminProperty } from "@/services/admin";

import { RoleGuard } from "@/components/shared/role-guard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loading } from "@/components/shared/loading";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<IAdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperties = async () => {
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
  }, []);

  return (
    <RoleGuard
      allowedRole="ADMIN"
      loadingText="Loading properties..."
      accessMessage="Only administrators can access property management."
    >
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
            {loading ? (
              <Loading text="Loading properties..." />
            ) : properties.length === 0 ? (
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
                              {property.bedrooms} bed • {property.bathrooms}{" "}
                              bath
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
    </RoleGuard>
  );
}
