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
    review?.metrics || []
  );
  const [strengths, setStrengths] = useState<string[]>(
    review?.strengths || [""]
  );
  const [improvements, setImprovements] = useState<string[]>(
    review?.areasForImprovement || [""]
  );
  const [goals, setGoals] = useState<string[]>(review?.goals || [""]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addMetric = () => {
    setMetrics([
      ...metrics,
      { name: "", rating: 0, weight: 1, comments: "" },
    ]);
  };

  const updateMetric = (index: number, field: keyof PerformanceMetric, value: string | number) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const addItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const updateItem = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData: Omit<PerformanceReview, "id"> = {
      ...formData,
      overallRating: Number(formData.overallRating),
      metrics: metrics.filter((m) => m.name),
      strengths: strengths.filter((s) => s.trim()),
      areasForImprovement: improvements.filter((i) => i.trim()),
      goals: goals.filter((g) => g.trim()),
    };

    onSubmit(reviewData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                required
              />
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
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />
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
                required
              />
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
              />
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
            <Label htmlFor="overallRating">Overall Rating (0-5)</Label>
            <Input
              id="overallRating"
              name="overallRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.overallRating}
              onChange={handleInputChange}
            />
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
                    onChange={(e) => updateMetric(index, "name", e.target.value)}
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
                onChange={(e) => updateItem(index, e.target.value, setStrengths)}
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {review ? "Update Review" : "Create Review"}
        </Button>
      </div>
    </form>
  );
}
