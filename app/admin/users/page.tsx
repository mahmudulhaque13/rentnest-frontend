"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getAllAdminUsers,
  updateAdminUserStatus,
  type IAdminUser,
} from "@/services/admin";

import { RoleGuard } from "@/components/shared/role-guard";
import { Loading } from "@/components/shared/loading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

function AdminUsersContent() {
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
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
        const result = await getAllAdminUsers(accessToken);

        if (!cancelled) {
          setUsers(result);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load users";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = async (
    userId: string,
    currentStatus: "ACTIVE" | "BLOCKED",
  ) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    setError("");
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

      toast.success(
        `User ${
          newStatus === "BLOCKED" ? "blocked" : "activated"
        } successfully.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user status";

      setError(message);
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loading text="Loading users..." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>

        <p className="mt-2 text-muted-foreground">
          View users and manage their account status.
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

      {/* Users */}
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
                    const isProtectedUser = item.role === "ADMIN";
                    const isUpdating = updatingId === item.id;

                    return (
                      <tr key={item.id} className="border-b last:border-0">
                        {/* Name */}
                        <td className="px-4 py-4 font-medium">{item.name}</td>

                        {/* Email */}
                        <td className="px-4 py-4 text-muted-foreground">
                          {item.email}
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-4 text-muted-foreground">
                          {item.phone}
                        </td>

                        {/* Role */}
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {item.role}
                          </span>
                        </td>

                        {/* Status */}
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

                        {/* Action */}
                        <td className="px-4 py-4 text-right">
                          {isProtectedUser ? (
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

export default function AdminUsersPage() {
  return (
    <RoleGuard
      allowedRole="ADMIN"
      loadingText="Checking admin access..."
      accessMessage="You are not authorized to access this page."
    >
      <AdminUsersContent />
    </RoleGuard>
  );
}
