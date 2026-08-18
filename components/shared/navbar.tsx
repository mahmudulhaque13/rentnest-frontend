"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-bold text-primary">RentNest</span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
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
          </div>

          {/* Auth */}
          <Link
            href="/auth/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
