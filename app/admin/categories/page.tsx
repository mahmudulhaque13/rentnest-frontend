"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/services/admin";

import type { ICategory } from "@/types/category.types";

import { RoleGuard } from "@/components/shared/role-guard";
import { Loading } from "@/components/shared/loading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function CategoriesContent() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [error, setError] = useState("");

  // ====================================================
  // GET CATEGORIES
  // ====================================================

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        if (!cancelled) {
          const message = "Please login again.";

          setError(message);
          setLoading(false);
          toast.error(message);
        }

        return;
      }

      try {
        const result = await getAllCategories(accessToken);

        if (!cancelled) {
          setCategories(result);
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load categories";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // ====================================================
  // RESET FORM
  // ====================================================

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingId(null);
    setError("");
  };

  // ====================================================
  // CREATE / UPDATE
  // ====================================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    if (!trimmedName) {
      const message = "Category name is required.";

      setError(message);
      toast.error(message);

      return;
    }

    if (!trimmedSlug) {
      const message = "Category slug is required.";

      setError(message);
      toast.error(message);

      return;
    }

    setError("");
    setSubmitting(true);

    try {
      // UPDATE
      if (editingId) {
        const updatedCategory = await updateCategory(
          editingId,
          {
            name: trimmedName,
            slug: trimmedSlug,
          },
          accessToken,
        );

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === editingId ? updatedCategory : category,
          ),
        );

        toast.success("Category updated successfully.");
      }

      // CREATE
      else {
        const newCategory = await createCategory(
          {
            name: trimmedName,
            slug: trimmedSlug,
          },
          accessToken,
        );

        setCategories((currentCategories) => [
          newCategory,
          ...currentCategories,
        ]);

        toast.success("Category created successfully.");
      }

      resetForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : editingId
            ? "Failed to update category"
            : "Failed to create category";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = (category: ICategory) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async (category: ICategory) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(category.id);

    try {
      await deleteCategory(category.id, accessToken);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) => currentCategory.id !== category.id,
        ),
      );

      if (editingId === category.id) {
        resetForm();
      }

      toast.success("Category deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete category";

      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return <Loading text="Loading categories..." />;
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Category Management</h1>

        <p className="mt-2 text-muted-foreground">
          Create, update, and manage property categories.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* =================================================
            CREATE / UPDATE FORM
        ================================================= */}

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>
              {editingId ? "Update Category" : "Create Category"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}

              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>

                <Input
                  id="category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Apartment"
                  disabled={submitting}
                />
              </div>

              {/* SLUG */}

              <div className="space-y-2">
                <Label htmlFor="category-slug">Slug</Label>

                <Input
                  id="category-slug"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      event.target.value.toLowerCase().replace(/\s+/g, "-"),
                    )
                  }
                  placeholder="e.g. apartment"
                  disabled={submitting}
                />

                <p className="text-xs text-muted-foreground">
                  Use lowercase letters and hyphens.
                </p>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Category"
                      : "Create Category"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* =================================================
            CATEGORY LIST
        ================================================= */}

        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>

          <CardContent>
            {categories.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center">
                <p className="font-medium">No categories found</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first category using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* CATEGORY INFO */}

                    <div className="min-w-0">
                      <h3 className="font-semibold">{category.name}</h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Slug: {category.slug}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        disabled={submitting || deletingId !== null}
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDelete(category)}
                        disabled={deletingId === category.id || submitting}
                      >
                        {deletingId === category.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// ======================================================
// ADMIN ROLE GUARD
// ======================================================

export default function AdminCategoriesPage() {
  return (
    <RoleGuard allowedRole="ADMIN">
      <CategoriesContent />
    </RoleGuard>
  );
}
