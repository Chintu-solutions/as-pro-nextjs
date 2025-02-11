"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateWebsiteRequest, WebsiteCategory } from "@/types/website";

interface AddWebsiteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWebsiteRequest) => Promise<void>;
}

const WEBSITE_CATEGORIES = [
  { value: "blog", label: "Blog" },
  { value: "news", label: "News" },
  { value: "entertainment", label: "Entertainment" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "other", label: "Other" },
] as const;

export function AddWebsiteModal({
  open,
  onClose,
  onSubmit,
}: AddWebsiteModalProps) {
  const [formData, setFormData] = useState<CreateWebsiteRequest>({
    domain: "",
    category: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form on close
  const handleClose = () => {
    setFormData({ domain: "", category: undefined });
    setError(null);
    onClose();
  };

  // Format domain by removing protocol and www
  const formatDomain = (domain: string): string => {
    return domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .replace(/\/$/, "");
  };

  // Validate domain format
  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-._]*\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleDomainChange = (value: string) => {
    const formattedDomain = formatDomain(value);
    setFormData((prev) => ({
      ...prev,
      domain: formattedDomain,
    }));

    // Clear error if domain is valid
    if (isValidDomain(formattedDomain)) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate domain
    if (!formData.domain) {
      setError("Domain is required");
      return;
    }

    if (!isValidDomain(formData.domain)) {
      setError("Please enter a valid domain name");
      return;
    }

    // Validate category
    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add website");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Website</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Website Domain</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={formData.domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                required
                autoComplete="off"
                autoFocus
                className={
                  error && !isValidDomain(formData.domain)
                    ? "border-destructive"
                    : ""
                }
              />
              <p className="text-sm text-muted-foreground">
                Enter your domain name without http:// or www
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as WebsiteCategory,
                  }))
                }
              >
                <SelectTrigger
                  id="category"
                  className={
                    error && !formData.category ? "border-destructive" : ""
                  }
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {WEBSITE_CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.domain || !formData.category}
            >
              {isSubmitting ? "Adding..." : "Add Website"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
