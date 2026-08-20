import Image from "next/image";
import Link from "next/link";

import { getProperties } from "@/services/property";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      {/* Properties Section */}
      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Properties</h2>

          <span className="text-sm text-muted-foreground">
            {response.meta.total} properties
          </span>
        </div>

        {/* Property Grid */}
        {response.data.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-xl font-semibold">No properties found</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                There are currently no properties available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {response.data.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                {/* Property Image */}
                <div className="relative h-52 w-full bg-muted">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardHeader>
                  <CardTitle>{property.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      {property.address}, {property.city}
                    </p>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        property.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <p className="mt-4 text-xl font-bold">
                    ৳{property.rent.toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>

                  <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    <span>{property.bedrooms} Bedrooms</span>

                    <span>{property.bathrooms} Bathrooms</span>
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    {property.category.name}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/properties/${property.id}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
