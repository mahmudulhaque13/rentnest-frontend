"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  district: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  images: string[];
  amenities: string[];
  category: {
    id: string;
    name: string;
  };
}

interface PropertyFiltersProps {
  properties: Property[];
}

export function PropertyFilters({ properties }: PropertyFiltersProps) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [amenity, setAmenity] = useState("");

  const categories = useMemo(() => {
    return Array.from(
      new Set(properties.map((property) => property.category.name)),
    ).sort();
  }, [properties]);

  const amenities = useMemo(() => {
    return Array.from(
      new Set(properties.flatMap((property) => property.amenities)),
    ).sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const minimum = minPrice ? Number(minPrice) : null;
    const maximum = maxPrice ? Number(maxPrice) : null;

    return properties.filter((property) => {
      const matchesSearch =
        !searchValue ||
        property.title.toLowerCase().includes(searchValue) ||
        property.address.toLowerCase().includes(searchValue) ||
        property.city.toLowerCase().includes(searchValue) ||
        property.district.toLowerCase().includes(searchValue);

      const matchesMinPrice = minimum === null || property.rent >= minimum;

      const matchesMaxPrice = maximum === null || property.rent <= maximum;

      const matchesCategory = !category || property.category.name === category;

      const matchesAmenity = !amenity || property.amenities.includes(amenity);

      return (
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesCategory &&
        matchesAmenity
      );
    });
  }, [properties, search, minPrice, maxPrice, category, amenity]);

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setAmenity("");
  };

  return (
    <>
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Search & Filter</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Find a property based on your preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="lg:col-span-2">
              <label
                htmlFor="property-search"
                className="mb-2 block text-sm font-medium"
              >
                Search
              </label>

              <input
                id="property-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Title, city, district..."
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Min Price */}
            <div>
              <label
                htmlFor="min-price"
                className="mb-2 block text-sm font-medium"
              >
                Min Price
              </label>

              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="৳10,000"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-sm font-medium"
              >
                Max Price
              </label>

              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="৳50,000"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="property-category"
                className="mb-2 block text-sm font-medium"
              >
                Property Type
              </label>

              <select
                id="property-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Types</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenity */}
          <div className="mt-4 max-w-md">
            <label
              htmlFor="property-amenity"
              className="mb-2 block text-sm font-medium"
            >
              Amenity
            </label>

            <select
              id="property-amenity"
              value={amenity}
              onChange={(event) => setAmenity(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Amenities</option>

              {amenities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Result Count */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Properties</h2>

        <span className="text-sm text-muted-foreground">
          {filteredProperties.length}{" "}
          {filteredProperties.length === 1 ? "property" : "properties"}
        </span>
      </div>

      {/* Property Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No properties found</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or filter options.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Clear Filters
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {/* Property Image */}
              <div className="relative h-52 w-full bg-muted">
                {property.images?.[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
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
                  {property.amenities.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item}
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
    </>
  );
}
