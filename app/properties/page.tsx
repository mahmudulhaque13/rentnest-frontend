import { getProperties } from "@/services/property";

import { PropertyFilters } from "@/components/property/property-filters";

export default async function PropertiesPage() {
  const response = await getProperties();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <section>
        <p className="text-sm font-medium text-primary">RentNest</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Available Properties
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Browse all available rental properties and find the perfect home for
          you.
        </p>
      </section>

      {/* Properties + Filters */}
      <section className="mt-10">
        <PropertyFilters properties={response.data} />
      </section>
    </main>
  );
}
