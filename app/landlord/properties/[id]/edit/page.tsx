"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getPropertyById, updateProperty } from "@/services/property";
import { getCategories } from "@/services/category";

import { Loading } from "@/components/shared/loading";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ICategory {
  id: string;
  name: string;
}

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [image, setImage] = useState("");
  const [amenities, setAmenities] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const property = await getPropertyById(id);
        const categoryData = await getCategories();

        setCategories(categoryData);

        setTitle(property.title);
        setDescription(property.description);
        setRent(String(property.rent));
        setBedrooms(String(property.bedrooms));
        setBathrooms(String(property.bathrooms));
        setAddress(property.address);
        setCity(property.city);
        setDistrict(property.district);
        setImage(property.images?.[0] || "");
        setAmenities(property.amenities?.join(", ") || "");
        setCategoryId(property.category.id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load property";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void loadData();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Please login again.");
      }

      await updateProperty(
        id,
        {
          title,
          description,
          rent: Number(rent),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          address,
          city,
          district,
          images: image ? [image] : [],
          amenities: amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          categoryId,
        },
        accessToken,
      );

      toast.success("Property updated successfully.");

      router.push("/landlord/properties");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update property";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <Loading text="Loading property..." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Property</CardTitle>

          <p className="text-sm text-muted-foreground">
            Update your property information.
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Rent */}
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent</Label>

              <Input
                id="rent"
                type="number"
                value={rent}
                onChange={(event) => setRent(event.target.value)}
                min="1"
                required
              />
            </div>

            {/* Bedrooms / Bathrooms */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>

                <Input
                  id="bedrooms"
                  type="number"
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>

                <Input
                  id="bathrooms"
                  type="number"
                  value={bathrooms}
                  onChange={(event) => setBathrooms(event.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>

              <Input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
              />
            </div>

            {/* City / District */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>

                <Input
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>

                <Input
                  id="district"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>

              <Input
                id="image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
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

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Updating..." : "Update Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
