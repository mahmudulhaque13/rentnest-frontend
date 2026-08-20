"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-bold text-primary">RentNest</span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {/* Common Navigation */}
            <Link
              href="/"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/properties"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Properties
            </Link>

            {/* Tenant Navigation */}
            {user?.role === "TENANT" && (
              <>
                <Link
                  href="/rental-requests"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  My Requests
                </Link>

                <Link
                  href="/payments"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Payments
                </Link>
              </>
            )}

            {/* Landlord Navigation */}
            {user?.role === "LANDLORD" && (
              <>
                <Link
                  href="/landlord/properties"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  My Properties
                </Link>

                <Link
                  href="/landlord/rental-requests"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Rental Requests
                </Link>

                <Link
                  href="/landlord/earnings"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Earnings
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>

                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Users
                </Link>

                <Link
                  href="/admin/properties"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Manage Properties
                </Link>

                <Link
                  href="/admin/rental-requests"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Rental Requests
                </Link>
              </>
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm text-muted-foreground">Loading...</span>
            ) : user ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">{user.email}</p>

                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
