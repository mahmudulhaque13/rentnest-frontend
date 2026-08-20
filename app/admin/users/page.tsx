"use client";

import { useEffect, useState } from "react";

import {
  getAllAdminUsers,
  updateAdminUserStatus,
  type IAdminUser,
} from "@/services/admin";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading || !user || user.role !== "ADMIN") {
      return;
    }

    const loadUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return;
      }

      try {
        const result = await getAllAdminUsers(accessToken);

        setUsers(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load users",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, [user, authLoading]);

  const handleStatusChange = async (
    userId: string,
    currentStatus: "ACTIVE" | "BLOCKED",
  ) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Please login again.");
      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    setError("");
    setSuccess("");
    setUpdatingId(userId);

    try {
      const updatedUser = await updateAdminUserStatus(
        userId,
        newStatus,
        accessToken,
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) => (item.id === userId ? updatedUser : item)),
      );

      setSuccess(
        `User ${
          newStatus === "BLOCKED" ? "blocked" : "activated"
        } successfully.`,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update user status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="space-y-4 py-8">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />

            <div className="h-64 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>

        <p className="mt-2 text-muted-foreground">
          View users and manage their account status.
        </p>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="py-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="mb-6">
          <CardContent className="py-4 text-sm text-green-700">
            {success}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Name</th>

                    <th className="px-4 py-3 font-medium">Email</th>

                    <th className="px-4 py-3 font-medium">Phone</th>

                    <th className="px-4 py-3 font-medium">Role</th>

                    <th className="px-4 py-3 font-medium">Status</th>

                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => {
                    const isAdmin = item.role === "ADMIN";

                    const isUpdating = updatingId === item.id;

                    return (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-4 py-4 font-medium">{item.name}</td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {item.email}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {item.phone}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {item.role}
                          </span>
                        </td>

                        <td className="px-4 py-4">
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

                        <td className="px-4 py-4 text-right">
                          {isAdmin ? (
                            <span className="text-xs text-muted-foreground">
                              Protected
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant={
                                item.status === "ACTIVE"
                                  ? "destructive"
                                  : "outline"
                              }
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(item.id, item.status)
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : item.status === "ACTIVE"
                                  ? "Ban User"
                                  : "Activate"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
