"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteProperty, getMyProperties } from "@/services/property";
import { useAuth } from "@/components/providers/auth-provider";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

function PropertiesContent() {
  const [properties, setProperties] = useState<IMyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [propertyToDelete, setPropertyToDelete] = useState<IMyProperty | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const loadProperties = async () => {
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
        const result = await getMyProperties(accessToken);

        if (!cancelled) {
          setProperties(result);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load properties";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    const id = propertyToDelete.id;

    setError("");
    setDeletingId(id);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Please login again.");
      }

      await deleteProperty(id, accessToken);

      setProperties((currentProperties) =>
        currentProperties.filter((property) => property.id !== id),
      );

      toast.success("Property deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete property";

      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
      setPropertyToDelete(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading properties...</p>
      </main>
    );
  }

  return (
    <>
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
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
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
              {/* Image */}
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

              {/* Information */}
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="line-clamp-1">
                    {property.title}
                  </CardTitle>

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
                {/* Rent */}
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

                {/* Bedrooms / Bathrooms */}
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
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Link
                    href={`/properties/${property.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    View
                  </Link>

                  <Link
                    href={`/landlord/properties/${property.id}/edit`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setPropertyToDelete(property)}
                    disabled={deletingId === property.id}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === property.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={propertyToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setPropertyToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete property?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {propertyToDelete?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId !== null ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function MyPropertiesPage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading...</p>
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

  return <PropertiesContent />;
}
