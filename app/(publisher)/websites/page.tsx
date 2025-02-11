"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Plus } from "lucide-react";
import { toast } from "sonner";

import { AddWebsiteModal } from "@/components/publisher/website/add-website-modal";
import { AdCodeModal } from "@/components/publisher/website/ad-code-modal";
import { WebsiteCard } from "@/components/publisher/website/website-card";

import type {
  Website,
  CreateWebsiteRequest,
  ApiResponse,
} from "@/types/website";

import { websiteApi, WebsiteApiError } from "@/lib/api/publisher/website";

interface EmptyStateProps {
  onAddWebsite: () => void;
}

function EmptyState({ onAddWebsite }: EmptyStateProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Globe className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Websites Added</h3>
        <p className="text-muted-foreground mb-4">
          Get started by adding your first website to implement ads
        </p>
        <Button onClick={onAddWebsite} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Your First Website
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-muted rounded w-1/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function WebsitesPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdCodeModal, setShowAdCodeModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);

  // Use SWR for data fetching with proper typing and data transformation
  const {
    data: response,
    error,
    mutate,
  } = useSWR<ApiResponse<Website[]>, WebsiteApiError>("/websites", async () => {
    const response = await websiteApi.getWebsites();
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map((website) => ({
          ...website,
          id: website._id, // Ensure we always have id from _id
        })),
      };
    }
    return response;
  });

  const handleAddWebsite = async (data: CreateWebsiteRequest) => {
    try {
      const response = await websiteApi.createWebsite(data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to add website");
      }

      // Update local data
      await mutate();
      setShowAddModal(false);
      toast.success("Website added successfully");

      // Get the website ID and navigate
      const websiteId = response.data._id;
      if (!websiteId) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      router.push(`/websites/${websiteId}/verify`);
    } catch (error) {
      if (error instanceof WebsiteApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add website");
      }
      console.error("Error adding website:", error);
    }
  };

  const handleViewScript = (websiteId: string) => {
    if (!websiteId) {
      toast.error("Invalid website selected");
      return;
    }
    setSelectedWebsite(websiteId);
    setShowAdCodeModal(true);
  };

  const handleVerifyWebsite = (websiteId: string) => {
    if (!websiteId) {
      toast.error("Unable to verify website");
      return;
    }
    router.push(`/websites/${websiteId}/verify`);
  };

  // Handle error state
  if (error) {
    return (
      <Card className="bg-destructive/10 p-6">
        <p className="text-destructive">
          {error instanceof WebsiteApiError
            ? error.message
            : "Failed to load websites"}
        </p>
      </Card>
    );
  }

  // Handle loading state
  if (!response) {
    return <LoadingSkeleton />;
  }

  const websites = response.data || [];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Websites</h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered websites and ad implementations
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Website
        </Button>
      </div>

      {/* Websites List */}
      {websites.length === 0 ? (
        <EmptyState onAddWebsite={() => setShowAddModal(true)} />
      ) : (
        <div className="grid gap-6">
          {websites.map((website) => (
            <WebsiteCard
              key={website._id}
              website={{
                ...website,
                id: website._id,
              }}
              onViewScript={() => handleViewScript(website._id)}
              onVerify={() => handleVerifyWebsite(website._id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddWebsiteModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddWebsite}
      />

      {selectedWebsite && (
        <AdCodeModal
          open={showAdCodeModal}
          onClose={() => {
            setShowAdCodeModal(false);
            setSelectedWebsite(null);
          }}
          websiteId={selectedWebsite}
        />
      )}
    </div>
  );
}
