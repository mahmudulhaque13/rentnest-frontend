"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { createRentalRequest } from "@/services/rental-request";
import { useAuth } from "@/components/providers/auth-provider";

import { Loading } from "@/components/shared/loading";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RentalRequestFormProps {
  propertyId: string;
}

export function RentalRequestForm({ propertyId }: RentalRequestFormProps) {
  const { user, loading: authLoading } = useAuth();

  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (authLoading) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <Loading text="Loading authentication..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Please login as a tenant to request this property.
        </p>
      </div>
    );
  }

  if (user.role !== "TENANT") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Only tenants can request this property.
        </p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Please login again.");
      }

      await createRentalRequest(
        {
          propertyId,
          moveInDate,
          message,
        },
        accessToken,
      );

      const successMessage = "Rental request submitted successfully.";

      setSuccess(successMessage);
      toast.success(successMessage);

      setMoveInDate("");
      setMessage("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit rental request";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Request to Rent</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Submit a rental request for this property.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Move-in Date */}
        <div className="space-y-2">
          <Label htmlFor="moveInDate">Move-in Date</Label>

          <Input
            id="moveInDate"
            type="date"
            value={moveInDate}
            onChange={(event) => setMoveInDate(event.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>

          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message to the landlord..."
            rows={4}
            required
            disabled={loading}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Success */}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Request to Rent"}
        </Button>
      </form>
    </div>
  );
}
