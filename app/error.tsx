"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
    toast.error("Something went wrong.");
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardContent className="py-12 text-center">
          <p className="text-sm font-medium text-destructive">
            Something went wrong
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            We could not load this page
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>

          <Button type="button" onClick={() => reset()} className="mt-6">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
