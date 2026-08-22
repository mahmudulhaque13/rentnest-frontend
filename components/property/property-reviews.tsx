"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createReview,
  deleteReview,
  getPropertyReviews,
  updateReview,
  type IReview,
} from "@/services/review";

import { useAuth } from "@/components/providers/auth-provider";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface PropertyReviewsProps {
  propertyId: string;
  averageRating: number;
}

export function PropertyReviews({
  propertyId,
  averageRating,
}: PropertyReviewsProps) {
  const { user, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [error, setError] = useState("");

  const [reviewToDelete, setReviewToDelete] = useState<IReview | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const result = await getPropertyReviews(propertyId);

        setReviews(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load reviews";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [propertyId]);

  const handleCreateReview = async () => {
    if (!user || user.role !== "TENANT") {
      const message = "Only tenants can submit reviews.";

      setError(message);
      toast.error(message);

      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    if (comment.trim().length < 10) {
      const message = "Comment must be at least 10 characters.";

      setError(message);
      toast.error(message);

      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const newReview = await createReview(
        {
          propertyId,
          rating,
          comment: comment.trim(),
        },
        accessToken,
      );

      setReviews((currentReviews) => [newReview, ...currentReviews]);

      setComment("");
      setRating(5);

      toast.success("Review submitted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit review";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    const reviewId = reviewToDelete.id;

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      setReviewToDelete(null);

      return;
    }

    setError("");
    setDeletingId(reviewId);

    try {
      await deleteReview(reviewId, accessToken);

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId),
      );

      toast.success("Review deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete review";

      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
      setReviewToDelete(null);
    }
  };

  const startEditing = (review: IReview) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdateReview = async (reviewId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const message = "Please login again.";

      setError(message);
      toast.error(message);

      return;
    }

    if (editComment.trim().length < 10) {
      const message = "Comment must be at least 10 characters.";

      setError(message);
      toast.error(message);

      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const updatedReview = await updateReview(
        reviewId,
        {
          rating: editRating,
          comment: editComment.trim(),
        },
        accessToken,
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId ? updatedReview : review,
        ),
      );

      setEditingId(null);
      setEditRating(5);
      setEditComment("");

      toast.success("Review updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update review";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    currentRating: number,
    clickable = false,
    onSelect?: (value: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!clickable}
            onClick={() => onSelect?.(star)}
            className={`text-2xl ${
              star <= currentRating ? "text-yellow-500" : "text-gray-300"
            } ${
              clickable
                ? "cursor-pointer hover:text-yellow-500"
                : "cursor-default"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const hasReviewed = user
    ? reviews.some((review) => review.tenantId === user.id)
    : false;

  return (
    <>
      <section className="mt-10 space-y-6">
        {/* Reviews Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>Reviews & Ratings</span>

              <span className="text-lg font-normal">
                ⭐ {averageRating.toFixed(1)} / 5
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card>
            <CardContent className="py-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Add Review */}
        {!authLoading && user?.role === "TENANT" && !hasReviewed && (
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">Rating</p>

                {renderStars(rating, true, setRating)}
              </div>

              <div>
                <label htmlFor="review-comment" className="text-sm font-medium">
                  Comment
                </label>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Write your experience about this property..."
                  rows={4}
                  maxLength={500}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  {comment.length}/500
                </p>
              </div>

              <Button onClick={handleCreateReview} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Login Message */}
        {!authLoading && !user && (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Please login as a tenant to submit a review.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Already Reviewed */}
        {!authLoading && user?.role === "TENANT" && hasReviewed && (
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              You have already reviewed this property.
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading reviews...
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet. Be the first to review this property.
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => {
                  const isOwner = user?.id === review.tenantId;

                  if (editingId === review.id) {
                    return (
                      <div key={review.id} className="rounded-lg border p-4">
                        <p className="mb-2 text-sm font-medium">Edit Rating</p>

                        {renderStars(editRating, true, setEditRating)}

                        <textarea
                          value={editComment}
                          onChange={(event) =>
                            setEditComment(event.target.value)
                          }
                          rows={4}
                          maxLength={500}
                          className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />

                        <p className="mt-1 text-xs text-muted-foreground">
                          {editComment.length}/500
                        </p>

                        <div className="mt-3 flex gap-2">
                          <Button
                            disabled={submitting}
                            onClick={() => handleUpdateReview(review.id)}
                          >
                            {submitting ? "Updating..." : "Update"}
                          </Button>

                          <Button
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <p className="font-semibold">
                            {review.tenant?.name ?? "Tenant"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {renderStars(review.rating)}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {review.comment}
                      </p>

                      {isOwner && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(review)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === review.id}
                            onClick={() => setReviewToDelete(review)}
                          >
                            {deletingId === review.id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Delete Review Confirmation Dialog */}
      <AlertDialog
        open={reviewToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setReviewToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId !== null ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
