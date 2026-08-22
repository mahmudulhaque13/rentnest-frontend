import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardContent className="py-12 text-center">
          <p className="text-sm font-medium text-primary">404</p>

          <h1 className="mt-2 text-3xl font-bold">Page not found</h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Sorry, the page you are looking for does not exist or may have been
            moved.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
