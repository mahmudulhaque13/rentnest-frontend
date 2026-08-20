import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardContent className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>

          <h1 className="mt-6 text-2xl font-bold">Payment Successful</h1>

          <p className="mt-3 text-muted-foreground">
            Your payment has been completed successfully.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Your payment status will be updated automatically.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/rental-requests"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              My Rental Requests
            </Link>

            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Browse Properties
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
