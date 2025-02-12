"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdCodeModal } from "@/components/publisher/website/ad-code-modal";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, Code } from "lucide-react";

interface Website {
  id: string;
  url: string;
  status: "pending" | "active" | "rejected";
  addedDate: string;
  lastChecked: string;
}

export default function WebsitesPage() {
  const [showAddWebsite, setShowAddWebsite] = useState(false);
  const [showAdCode, setShowAdCode] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");

  // Example websites data
  const websites: Website[] = [
    {
      id: "1",
      url: "https://example.com",
      status: "active",
      addedDate: "2024-03-20",
      lastChecked: "2024-03-25",
    },
    {
      id: "2",
      url: "https://myblog.com",
      status: "pending",
      addedDate: "2024-03-24",
      lastChecked: "2024-03-24",
    },
  ];

  const handleViewScript = (websiteId: string) => {
    setSelectedWebsite(websiteId);
    setShowAdCode(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Websites</h1>
        <Button onClick={() => setShowAddWebsite(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </div>

      <div className="grid gap-6">
        {websites.map((website) => (
          <Card key={website.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {website.url}
                </CardTitle>
                <CardDescription>Added on {website.addedDate}</CardDescription>
              </div>
              <Badge
                variant={
                  website.status === "active"
                    ? "default"
                    : website.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {website.status.charAt(0).toUpperCase() +
                  website.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Last checked: {website.lastChecked}
                </div>
                {website.status === "active" && (
                  <Button
                    variant="outline"
                    onClick={() => handleViewScript(website.id)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    View Script
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdCodeModal
        open={showAdCode}
        onClose={() => setShowAdCode(false)}
        websiteId={selectedWebsite}
      />
    </div>
  );
}
