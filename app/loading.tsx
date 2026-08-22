import { Loading } from "@/components/shared/loading";

export default function LoadingPage() {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center px-4 py-10">
      <Loading text="Loading..." />
    </main>
  );
}
