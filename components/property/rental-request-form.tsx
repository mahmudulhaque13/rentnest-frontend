"use client";

import { FormEvent, useState } from "react";

import { createRentalRequest } from "@/services/rental-request";
import { useAuth } from "@/components/providers/auth-provider";

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
      <div className="mt-8 rounded-xl border p-6">
        Loading authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-8 rounded-xl border p-6">
        Please login as a tenant to request this property.
      </div>
    );
  }

  if (user.role !== "TENANT") {
    return (
      <div className="mt-8 rounded-xl border p-6">
        Only tenants can request this property.
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
        throw new Error("Please login again");
      }

      await createRentalRequest(
        {
          propertyId,
          moveInDate,
          message,
        },
        accessToken,
      );

      setSuccess("Rental request submitted successfully.");
      setMoveInDate("");
      setMessage("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit rental request",
      );
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
        <div className="space-y-2">
          <Label htmlFor="moveInDate">Move-in Date</Label>

          <Input
            id="moveInDate"
            type="date"
            value={moveInDate}
            onChange={(event) => setMoveInDate(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>

          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message to the landlord..."
            rows={4}
            required
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Request to Rent"}
        </Button>
      </form>
    </div>
  );
}
