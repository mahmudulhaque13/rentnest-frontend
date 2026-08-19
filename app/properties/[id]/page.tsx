import Image from "next/image";
import { getPropertyById } from "@/services/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentalRequestForm } from "@/components/property/rental-request-form";

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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Property Image */}
        <div className="relative h-[400px] overflow-hidden rounded-xl bg-muted">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
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
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                ৳{property.rent.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  property.status === "AVAILABLE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {property.status}
              </span>
            </div>

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

            <div className="mt-6">
              <h2 className="font-semibold">Description</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {property.description}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold">Amenities</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold">Category</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {property.category.name}
              </p>
            </div>

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
      <RentalRequestForm propertyId={property.id} />
    </main>
  );
}
