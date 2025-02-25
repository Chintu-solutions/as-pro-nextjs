"use client";

import { useState, useEffect } from "react";
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
import { PublisherDetailsModal } from "@/components/admin/modals/publisher-details-modal";
import { Search, Download, Loader2, Eye } from "lucide-react";
import { publisherApi } from "@/lib/api/admin/publisher";
import type { Publisher } from "@/types/publishers";
import { toast } from "sonner";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPublishers();
  }, []);

  const loadPublishers = async (search?: string) => {
    try {
      const response = await publisherApi.getPublishers({
        search,
        limit: 10,
        page: 1,
      });
      setPublishers(response.data.publishers);
    } catch (error) {
      toast.error(publisherApi.handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadPublishers(value);
  };

  const handleViewDetails = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setShowDetails(true);
  };

  const handlePublisherUpdate = () => {
    loadPublishers(searchTerm);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Publishers</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Publisher List</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search publishers..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No publishers found
                  </TableCell>
                </TableRow>
              ) : (
                publishers.map((publisher) => (
                  <TableRow key={publisher.id}>
                    <TableCell className="font-medium">
                      {publisher.name}
                    </TableCell>
                    <TableCell>{publisher.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          publisher.status === "active"
                            ? "bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800"
                            : publisher.status === "pending"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {publisher.status.charAt(0).toUpperCase() +
                          publisher.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(publisher.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleViewDetails(publisher)}
                        className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white hover:from-slate-800 hover:to-indigo-800 transition-all duration-200"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPublisher && (
        <PublisherDetailsModal
          open={showDetails}
          onClose={() => setShowDetails(false)}
          publisher={selectedPublisher}
          onUpdate={handlePublisherUpdate}
        />
      )}
    </div>
  );
}
