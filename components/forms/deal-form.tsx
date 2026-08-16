/**
 * Deal creation and edit form
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Deal, PipelineStage } from "@/lib/api/types/pipeline";
import type { Contact } from "@/lib/api/types/contact";

interface DealFormProps {
  deal?: Deal | null;
  stages: PipelineStage[];
  contacts: Contact[];
  onSubmit: (dealData: Partial<Deal>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function DealForm({
  deal,
  stages,
  contacts,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DealFormProps) {
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: "",
    value: 0,
    currency: "USD",
    contact: "",
    stage: stages[0]?.id || "",
    probability: 50,
    expected_close_date: "",
    owner: "",
    description: "",
  });

  // Initialize form with deal data if editing
  useEffect(() => {
    if (deal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Refresh the editable draft when the selected API entity changes.
      setFormData({
        title: deal.title,
        value: deal.value,
        currency: deal.currency,
        contact: deal.contact,
        stage: deal.stage,
        probability: deal.probability,
        expected_close_date: deal.expected_close_date || "",
        owner: deal.owner,
        description: deal.description || "",
      });
    }
  }, [deal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Deal Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter deal title"
          required
        />
      </div>

      {/* Value */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) => handleChange("value", parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleChange("currency", value)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="contact">Contact *</Label>
        <Select
          value={formData.contact || ""}
          onValueChange={(value) => handleChange("contact", value)}
        >
          <SelectTrigger id="contact">
            <SelectValue placeholder="Select contact" />
          </SelectTrigger>
          <SelectContent>
            {contacts.length === 0 ? (
              <SelectItem value="" disabled>
                No contacts available
              </SelectItem>
            ) : (
              contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Stage */}
      <div className="space-y-2">
        <Label htmlFor="stage">Stage *</Label>
        <Select
          value={formData.stage || ""}
          onValueChange={(value) => handleChange("stage", value)}
        >
          <SelectTrigger id="stage">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name} ({stage.probability}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Probability */}
      <div className="space-y-2">
        <Label htmlFor="probability">Probability (%)</Label>
        <Input
          id="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => handleChange("probability", parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Expected Close Date */}
      <div className="space-y-2">
        <Label htmlFor="expected_close_date">Expected Close Date</Label>
        <Input
          id="expected_close_date"
          type="date"
          value={formData.expected_close_date || ''}
          onChange={(e) => handleChange("expected_close_date", e.target.value)}
        />
      </div>

      {/* Owner */}
      <div className="space-y-2">
        <Label htmlFor="owner">Owner</Label>
        <Input
          id="owner"
          value={formData.owner || ""}
          onChange={(e) => handleChange("owner", e.target.value)}
          placeholder="Enter owner name or ID"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add notes or description"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}
