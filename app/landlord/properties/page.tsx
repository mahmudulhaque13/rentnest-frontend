"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getMyProperties } from "@/services/property";
import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IMyProperty {
  id: string;
  title: string;
  description: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  district: string;
  images: string[];
  amenities: string[];
  status: string;
  category: {
    id: string;
    name: string;
  };
}

export default function MyPropertiesPage() {
  const { user, loading: authLoading } = useAuth();

  const [properties, setProperties] = useState<IMyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperties = async () => {
      if (authLoading) return;

      if (!user || user.role !== "LANDLORD") {
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
        const result = await getMyProperties(accessToken);

        setProperties(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load properties",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading properties...</p>
      </main>
    );
  }

  if (!user || user.role !== "LANDLORD") {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">Landlord access only</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Only landlords can manage properties.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>

          <p className="mt-2 text-muted-foreground">
            Manage the properties you have listed.
          </p>
        </div>

        <Link
          href="/landlord/properties/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          + Add Property
        </Link>
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
      {!error && properties.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No properties yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create your first property to get started.
            </p>

            <Link
              href="/landlord/properties/create"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Create Property
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Property Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            {/* Property Image */}
            <div className="relative h-52 w-full overflow-hidden bg-muted">
              {property.images?.[0] ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Property Information */}
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="line-clamp-1">{property.title}</CardTitle>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    property.status === "AVAILABLE"
                      ? "bg-green-100 text-green-700"
                      : property.status === "RENTED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {property.address}, {property.city}, {property.district}
              </p>
            </CardHeader>

            <CardContent>
              {/* Rent & Category */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-bold">
                  ৳{property.rent.toLocaleString()}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    /month
                  </span>
                </p>

                <span className="text-sm text-muted-foreground">
                  {property.category.name}
                </span>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Bedrooms</p>

                  <p className="mt-1 font-semibold">{property.bedrooms}</p>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Bathrooms</p>

                  <p className="mt-1 font-semibold">{property.bathrooms}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <Link
                  href={`/properties/${property.id}`}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  View
                </Link>

                <Link
                  href={`/landlord/properties/${property.id}/edit`}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Edit
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
