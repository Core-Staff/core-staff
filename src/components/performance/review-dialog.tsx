"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./review-form";
import { reviewsApi } from "@/lib/api/performance";
import type { PerformanceReview } from "@/types/performance";
import { Plus } from "lucide-react";

type ReviewDialogProps = {
  review?: PerformanceReview;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
};

export function ReviewDialog({
  review,
  trigger,
  onSuccess,
}: ReviewDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: Omit<PerformanceReview, "id">) => {
    try {
      if (review) {
        // Update existing review
        const response = await reviewsApi.update(review.id, data);
        if (response.success) {
          console.log("Review updated successfully");
          setOpen(false);
          onSuccess?.();
        } else {
          console.error("Failed to update review:", response.error);
        }
      } else {
        // Create new review
        const response = await reviewsApi.create(data);
        if (response.success) {
          console.log("Review created successfully");
          setOpen(false);
          onSuccess?.();
        } else {
          console.error("Failed to create review:", response.error);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {review ? "Edit Performance Review" : "Create Performance Review"}
          </DialogTitle>
          <DialogDescription>
            {review
              ? "Update the performance review details below."
              : "Fill in the form below to create a new performance review."}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          review={review}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
