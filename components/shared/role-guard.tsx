"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";

import { Card, CardContent } from "@/components/ui/card";

import { Loading } from "@/components/shared/loading";

type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

interface RoleGuardProps {
  allowedRole: UserRole;
  children: React.ReactNode;
  loadingText?: string;
  accessMessage?: string;
}

export function RoleGuard({
  allowedRole,
  children,
  loadingText = "Loading...",
  accessMessage,
}: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Loading text={loadingText} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg">
          <CardContent className="py-12 text-center">
            <h1 className="text-xl font-semibold">Login required</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please login to access this page.
            </p>

            <Link
              href="/auth/login"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (user.role !== allowedRole) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg">
          <CardContent className="py-12 text-center">
            <h1 className="text-xl font-semibold">{allowedRole} access only</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {accessMessage ??
                `Only ${allowedRole.toLowerCase()} users can access this page.`}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <>{children}</>;
}
