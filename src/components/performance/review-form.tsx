"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PerformanceReview, PerformanceMetric } from "@/types/performance";
import { X, Plus } from "lucide-react";

type ValidationError = {
  field: string;
  message: string;
};

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Date validation (YYYY-MM-DD format)
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Helper functions
const isValidUUID = (value: string): boolean => UUID_REGEX.test(value.trim());
const isValidDate = (value: string): boolean => {
  if (!DATE_REGEX.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};
const isWhitespaceOnly = (value: string): boolean => value.trim().length === 0;

type ReviewFormProps = {
  review?: PerformanceReview;
  onSubmit: (data: Omit<PerformanceReview, "id">) => void;
  onCancel: () => void;
};

export function ReviewForm({ review, onSubmit, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    employeeId: review?.employeeId || "",
    employeeName: review?.employeeName || "",
    position: review?.position || "",
    reviewerId: review?.reviewerId || "",
    reviewerName: review?.reviewerName || "",
    period: review?.period || "",
    reviewDate: review?.reviewDate || new Date().toISOString().split("T")[0],
    status: review?.status || "pending",
    overallRating: review?.overallRating || 0,
    comments: review?.comments || "",
  });

  const [metrics, setMetrics] = useState<PerformanceMetric[]>(
    review?.metrics || [],
  );
  const [strengths, setStrengths] = useState<string[]>(
    review?.strengths || [""],
  );
  const [improvements, setImprovements] = useState<string[]>(
    review?.areasForImprovement || [""],
  );
  const [goals, setGoals] = useState<string[]>(review?.goals || [""]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addMetric = () => {
    setMetrics([...metrics, { name: "", rating: 0, weight: 1, comments: "" }]);
  };

  const updateMetric = (
    index: number,
    field: keyof PerformanceMetric,
    value: string | number,
  ) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const updateItem = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    // Employee ID validation
    if (!formData.employeeId || isWhitespaceOnly(formData.employeeId)) {
      validationErrors.push({
        field: "employeeId",
        message: "Employee ID is required",
      });
    } else if (!isValidUUID(formData.employeeId)) {
      validationErrors.push({
        field: "employeeId",
        message:
          "Employee ID must be a valid UUID (e.g., 914771d2-2ae0-47ed-b50c-b1285b5925e2)",
      });
    }

    // Reviewer ID validation
    if (!formData.reviewerId || isWhitespaceOnly(formData.reviewerId)) {
      validationErrors.push({
        field: "reviewerId",
        message: "Reviewer ID is required",
      });
    } else if (!isValidUUID(formData.reviewerId)) {
      validationErrors.push({
        field: "reviewerId",
        message:
          "Reviewer ID must be a valid UUID (e.g., b5a6780b-70c1-421b-934a-539379777e6a)",
      });
    }

    // Position validation
    if (!formData.position || isWhitespaceOnly(formData.position)) {
      validationErrors.push({
        field: "position",
        message: "Position is required and cannot be only whitespace",
      });
    } else if (formData.position.trim().length < 2) {
      validationErrors.push({
        field: "position",
        message: "Position must be at least 2 characters long",
      });
    }

    // Review date validation
    if (!formData.reviewDate) {
      validationErrors.push({
        field: "reviewDate",
        message: "Review date is required",
      });
    } else if (!isValidDate(formData.reviewDate)) {
      validationErrors.push({
        field: "reviewDate",
        message: "Review date must be in YYYY-MM-DD format",
      });
    } else {
      // Check if date is not in the future
      const reviewDate = new Date(formData.reviewDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (reviewDate > today) {
        validationErrors.push({
          field: "reviewDate",
          message: "Review date cannot be in the future",
        });
      }

      // Check if date is not too old (e.g., more than 5 years ago)
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      if (reviewDate < fiveYearsAgo) {
        validationErrors.push({
          field: "reviewDate",
          message: "Review date cannot be more than 5 years in the past",
        });
      }
    }

    // Overall rating validation (must be INTEGER between 1-5)
    const ratingStr = String(formData.overallRating);
    const rating = Number(formData.overallRating);

    if (!ratingStr || ratingStr.trim() === "") {
      validationErrors.push({
        field: "overallRating",
        message: "Overall rating is required",
      });
    } else if (isNaN(rating)) {
      validationErrors.push({
        field: "overallRating",
        message: "Overall rating must be a valid number",
      });
    } else if (!Number.isInteger(rating)) {
      validationErrors.push({
        field: "overallRating",
        message:
          "Overall rating must be a whole number (integers only: 1, 2, 3, 4, or 5)",
      });
    } else if (rating < 1 || rating > 5) {
      validationErrors.push({
        field: "overallRating",
        message: "Overall rating must be between 1 and 5",
      });
    }

    // Metrics validation
    metrics.forEach((metric, index) => {
      if (metric.name && metric.name.trim()) {
        // Validate metric name length
        if (metric.name.trim().length < 2) {
          validationErrors.push({
            field: `metric-${index}-name`,
            message: `Metric name must be at least 2 characters long`,
          });
        }

        // Validate metric rating
        if (metric.rating < 0 || metric.rating > 5) {
          validationErrors.push({
            field: `metric-${index}-rating`,
            message: `Metric "${metric.name}" rating must be between 0 and 5`,
          });
        }

        // Validate metric weight
        if (metric.weight !== undefined && metric.weight <= 0) {
          validationErrors.push({
            field: `metric-${index}-weight`,
            message: `Metric "${metric.name}" weight must be greater than 0`,
          });
        }
      }
    });

    // Validate array items for minimum length
    strengths.forEach((strength, index) => {
      if (strength.trim() && strength.trim().length < 3) {
        validationErrors.push({
          field: `strength-${index}`,
          message: "Strength must be at least 3 characters long",
        });
      }
    });

    improvements.forEach((improvement, index) => {
      if (improvement.trim() && improvement.trim().length < 3) {
        validationErrors.push({
          field: `improvement-${index}`,
          message: "Area for improvement must be at least 3 characters long",
        });
      }
    });

    goals.forEach((goal, index) => {
      if (goal.trim() && goal.trim().length < 3) {
        validationErrors.push({
          field: `goal-${index}`,
          message: "Goal must be at least 3 characters long",
        });
      }
    });

    // Check that at least one meaningful field is filled
    const hasStrengths = strengths.some((s) => s.trim());
    const hasImprovements = improvements.some((i) => i.trim());
    const hasGoals = goals.some((g) => g.trim());
    const hasComments = formData.comments.trim();
    const hasMetrics = metrics.some((m) => m.name);

    if (
      !hasStrengths &&
      !hasImprovements &&
      !hasGoals &&
      !hasComments &&
      !hasMetrics
    ) {
      validationErrors.push({
        field: "general",
        message:
          "Please provide at least one of: strengths, areas for improvement, goals, comments, or metrics",
      });
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors([]);

    // Validate form
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      const firstErrorField = document.getElementById(
        validationErrors[0].field,
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Trim all string values before submission
      const reviewData: Omit<PerformanceReview, "id"> = {
        ...formData,
        employeeId: formData.employeeId.trim(),
        reviewerId: formData.reviewerId.trim(),
        position: formData.position.trim(),
        overallRating: Number(formData.overallRating),
        metrics: metrics
          .filter((m) => m.name && m.name.trim())
          .map((m) => ({
            ...m,
            name: m.name.trim(),
            comments: m.comments?.trim() || "",
          })),
        strengths: strengths.filter((s) => s.trim()).map((s) => s.trim()),
        areasForImprovement: improvements
          .filter((i) => i.trim())
          .map((i) => i.trim()),
        goals: goals.filter((g) => g.trim()).map((g) => g.trim()),
        comments: formData.comments?.trim() || undefined,
      };

      await onSubmit(reviewData);
    } catch (error) {
      setErrors([
        {
          field: "general",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while submitting the form",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((error) => error.field === field)?.message;
  };

  const hasGeneralError = (): string | undefined => {
    return errors.find((error) => error.field === "general")?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Errors */}
      {hasGeneralError() && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Validation Error</p>
          <p className="text-sm">{hasGeneralError()}</p>
        </div>
      )}

      {/* Employee Information */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="e.g., 914771d2-2ae0-47ed-b50c-b1285b5925e2"
                required
                className={getFieldError("employeeId") ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-600">
                Must be a valid UUID format
              </p>
              {getFieldError("employeeId") && (
                <p className="text-sm text-red-600">
                  {getFieldError("employeeId")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeName">Employee Name *</Label>
              <Input
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              className={getFieldError("position") ? "border-red-500" : ""}
            />
            {getFieldError("position") && (
              <p className="text-sm text-red-600">
                {getFieldError("position")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviewer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Reviewer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reviewerId">Reviewer ID *</Label>
              <Input
                id="reviewerId"
                name="reviewerId"
                value={formData.reviewerId}
                onChange={handleInputChange}
                placeholder="e.g., b5a6780b-70c1-421b-934a-539379777e6a"
                required
                className={getFieldError("reviewerId") ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-600">
                Must be a valid UUID format
              </p>
              {getFieldError("reviewerId") && (
                <p className="text-sm text-red-600">
                  {getFieldError("reviewerId")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewerName">Reviewer Name *</Label>
              <Input
                id="reviewerName"
                name="reviewerName"
                value={formData.reviewerName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Details */}
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Period *</Label>
              <Input
                id="period"
                name="period"
                placeholder="Q4 2025"
                value={formData.period}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewDate">Review Date *</Label>
              <Input
                id="reviewDate"
                name="reviewDate"
                type="date"
                value={formData.reviewDate}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split("T")[0]}
                className={getFieldError("reviewDate") ? "border-red-500" : ""}
              />
              {getFieldError("reviewDate") && (
                <p className="text-sm text-red-600">
                  {getFieldError("reviewDate")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overallRating">Overall Rating (1-5) *</Label>
            <Input
              id="overallRating"
              name="overallRating"
              type="number"
              min="1"
              max="5"
              step="1"
              value={formData.overallRating}
              onChange={handleInputChange}
              required
              className={getFieldError("overallRating") ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-600">
              Must be a whole number (1, 2, 3, 4, or 5)
            </p>
            {getFieldError("overallRating") && (
              <p className="text-sm text-red-600">
                {getFieldError("overallRating")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Metrics</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addMetric}>
            <Plus className="mr-2 h-4 w-4" />
            Add Metric
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Metric name"
                    value={metric.name}
                    onChange={(e) =>
                      updateMetric(index, "name", e.target.value)
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Rating (0-5)"
                      min="0"
                      max="5"
                      step="0.1"
                      value={metric.rating}
                      onChange={(e) =>
                        updateMetric(index, "rating", Number(e.target.value))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Weight"
                      min="0"
                      step="0.1"
                      value={metric.weight}
                      onChange={(e) =>
                        updateMetric(index, "weight", Number(e.target.value))
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Comments"
                    value={metric.comments}
                    onChange={(e) =>
                      updateMetric(index, "comments", e.target.value)
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMetric(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Strengths</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem(setStrengths)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Strength
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {strengths.map((strength, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Enter a strength"
                value={strength}
                onChange={(e) =>
                  updateItem(index, e.target.value, setStrengths)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index, setStrengths)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Areas for Improvement</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem(setImprovements)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Area
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Enter an area for improvement"
                value={improvement}
                onChange={(e) =>
                  updateItem(index, e.target.value, setImprovements)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index, setImprovements)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Goals for Next Period</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem(setGoals)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Enter a goal"
                value={goal}
                onChange={(e) => updateItem(index, e.target.value, setGoals)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index, setGoals)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="comments"
            placeholder="Enter any additional comments or observations"
            value={formData.comments}
            onChange={handleInputChange}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Submitting..."
            : review
              ? "Update Review"
              : "Create Review"}
        </Button>
      </div>
    </form>
  );
}
