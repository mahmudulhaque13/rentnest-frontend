import Image from "next/image";

import { getPropertyById } from "@/services/property";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { RentalRequestForm } from "@/components/property/rental-request-form";

import { PropertyReviews } from "@/components/property/property-reviews";

interface PropertyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  const property = await getPropertyById(id);

  const isAvailable = property.status === "AVAILABLE";
  const isRented = property.status === "RENTED";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Property Details */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Property Image */}
        <div className="relative h-[400px] overflow-hidden rounded-xl bg-muted">
          {property.images?.[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{property.title}</CardTitle>

            <p className="text-muted-foreground">
              {property.address}, {property.city}, {property.district}
            </p>
          </CardHeader>

          <CardContent>
            {/* Rent + Status */}
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                ৳{property.rent.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : isRented
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {property.status}
              </span>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-lg">⭐</span>

              <span className="font-semibold">
                {property.averageRating.toFixed(1)}
              </span>

              <span className="text-sm text-muted-foreground">
                Average Rating
              </span>
            </div>

            {/* Bedrooms / Bathrooms */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Bedrooms</p>

                <p className="mt-1 font-semibold">{property.bedrooms}</p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Bathrooms</p>

                <p className="mt-1 font-semibold">{property.bathrooms}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="font-semibold">Description</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <h2 className="font-semibold">Amenities</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.length > 0 ? (
                  property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No amenities listed.
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="mt-6">
              <h2 className="font-semibold">Category</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {property.category.name}
              </p>
            </div>

            {/* Landlord */}
            <div className="mt-6">
              <h2 className="font-semibold">Landlord</h2>

              <div className="mt-2 text-sm text-muted-foreground">
                <p>{property.landlord.name}</p>

                <p>{property.landlord.email}</p>

                <p>{property.landlord.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rental Request */}
      {isAvailable ? (
        <RentalRequestForm propertyId={property.id} />
      ) : (
        <Card className="mt-10">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold">
              {isRented
                ? "Property Already Rented"
                : "Property Currently Unavailable"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {isRented
                ? "This property has already been rented and is no longer accepting rental requests."
                : "This property is currently unavailable and is not accepting rental requests."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <PropertyReviews
        propertyId={property.id}
        averageRating={property.averageRating}
      />
    </main>
  );
}
