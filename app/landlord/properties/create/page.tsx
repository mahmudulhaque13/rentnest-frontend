"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createProperty } from "@/services/property";
import { getCategories } from "@/services/category";
import { useAuth } from "@/components/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ICategory } from "@/types/category.types";

export default function CreatePropertyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [amenities, setAmenities] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load categories",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!user || user.role !== "LANDLORD") {
      setError("Only landlords can create properties.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Please login again.");
      return;
    }

    const images = imageUrl
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);

    const amenitiesList = amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean);

    if (images.length === 0) {
      setError("At least one image URL is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      await createProperty(
        {
          title,
          description,
          rent: Number(rent),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          address,
          city,
          district,
          images,
          amenities: amenitiesList,
          categoryId,
        },
        accessToken,
      );

      router.push("/landlord/properties");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create property",
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user || user.role !== "LANDLORD") {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="rounded-xl border p-6 text-center">
          <h1 className="text-xl font-semibold">Landlord access only</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Only landlords can create properties.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Property</h1>

        <p className="mt-2 text-muted-foreground">
          Add a new rental property to RentNest.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Luxury Apartment"
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your property..."
              rows={5}
              required
              minLength={10}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent</Label>

            <Input
              id="rent"
              type="number"
              min="1"
              value={rent}
              onChange={(event) => setRent(event.target.value)}
              placeholder="25000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={categoriesLoading}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>

            <Input
              id="bedrooms"
              type="number"
              min="1"
              value={bedrooms}
              onChange={(event) => setBedrooms(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>

            <Input
              id="bathrooms"
              type="number"
              min="1"
              value={bathrooms}
              onChange={(event) => setBathrooms(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>

            <Input
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="House 12, Road 5"
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>

            <Input
              id="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Dhaka"
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District</Label>

            <Input
              id="district"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              placeholder="Dhaka"
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="imageUrl">Image URLs</Label>

            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />

            <p className="text-xs text-muted-foreground">
              Add multiple image URLs separated by commas.
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="amenities">Amenities</Label>

            <Input
              id="amenities"
              value={amenities}
              onChange={(event) => setAmenities(event.target.value)}
              placeholder="WiFi, Parking, Lift, Security"
            />

            <p className="text-xs text-muted-foreground">
              Separate amenities with commas.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || categoriesLoading}
          className="w-full"
        >
          {loading ? "Creating Property..." : "Create Property"}
        </Button>
      </form>
    </main>
  );
}
