"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WebsiteDetailsModal } from "@/components/admin/modals/website-details-modal";
import { Search, Download, ExternalLink } from "lucide-react";

const websites = [
  {
    id: "1",
    url: "example.com",
    publisher: "John Doe",
    category: "Blog",
    traffic: 45231,
    earnings: 2345.67,
    status: "active",
    lastChecked: "2024-03-25",
  },
  {
    id: "2",
    url: "myblog.com",
    publisher: "Jane Smith",
    category: "News",
    traffic: 32456,
    earnings: 1890.45,
    status: "pending",
    lastChecked: "2024-03-24",
  },
  {
    id: "3",
    url: "techsite.com",
    publisher: "Bob Wilson",
    category: "Technology",
    traffic: 28901,
    earnings: 1567.89,
    status: "suspended",
    lastChecked: "2024-03-23",
  },
];

export default function WebsitesPage() {
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (website: any) => {
    setSelectedWebsite(website);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Websites</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Website List</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search websites..."
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Traffic</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites.map((website) => (
                <TableRow key={website.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {website.url}
                      <a
                        href={`https://${website.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{website.publisher}</TableCell>
                  <TableCell>{website.category}</TableCell>
                  <TableCell>{website.traffic.toLocaleString()}</TableCell>
                  <TableCell>${website.earnings.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        website.status === "active"
                          ? "default"
                          : website.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{website.lastChecked}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(website)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedWebsite && (
        <WebsiteDetailsModal
          open={showDetails}
          onClose={() => setShowDetails(false)}
          website={selectedWebsite}
        />
      )}
    </div>
  );
}