"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-primary">RentNest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {/* Common */}
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

            {/* Tenant */}
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

            {/* Landlord */}
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

            {/* Admin */}
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

          {/* Desktop Auth */}
          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <span className="text-sm text-muted-foreground">Loading...</span>
            ) : user ? (
              <>
                <div className="text-right">
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {!loading && user && (
              <span className="max-w-32 truncate text-xs text-muted-foreground">
                {user.role}
              </span>
            )}

            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted"
            >
              {mobileMenuOpen ? (
                <span className="text-xl leading-none">×</span>
              ) : (
                <span className="text-xl leading-none">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {/* Common */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
              >
                Home
              </Link>

              <Link
                href="/properties"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
              >
                Properties
              </Link>

              {/* Tenant */}
              {user?.role === "TENANT" && (
                <>
                  <Link
                    href="/rental-requests"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    My Requests
                  </Link>

                  <Link
                    href="/payments"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Payments
                  </Link>
                </>
              )}

              {/* Landlord */}
              {user?.role === "LANDLORD" && (
                <>
                  <Link
                    href="/landlord/properties"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    My Properties
                  </Link>

                  <Link
                    href="/landlord/rental-requests"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Rental Requests
                  </Link>

                  <Link
                    href="/landlord/earnings"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Earnings
                  </Link>
                </>
              )}

              {/* Admin */}
              {user?.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/admin/users"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Users
                  </Link>

                  <Link
                    href="/admin/properties"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Manage Properties
                  </Link>

                  <Link
                    href="/admin/rental-requests"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                  >
                    Rental Requests
                  </Link>
                </>
              )}

              {/* Mobile Auth */}
              <div className="mt-3 border-t border-border pt-3">
                {loading ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    Loading...
                  </p>
                ) : user ? (
                  <div className="space-y-3 px-3">
                    <div>
                      <p className="truncate text-sm font-medium">
                        {user.email}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {user.role}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className="mx-3 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
