/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Search,
  Download,
  ExternalLink,
  Eye,
  Loader2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { websiteApi } from "@/lib/api/admin/website";
import type { Website, WebsiteFilters } from "@/types/website";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<WebsiteFilters>({
    search: "",
    status: undefined,
    category: undefined,
    isVerified: undefined,
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    verified: 0,
  });

  useEffect(() => {
    loadWebsites();
    loadStats();
  }, [filters]);

  const loadWebsites = async () => {
    try {
      setIsLoading(true);
      const response = await websiteApi.getWebsites(filters);
      setWebsites(response.data.websites);
    } catch (error) {
      toast.error("Failed to load websites");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await websiteApi.getWebsiteStats();
      if (response.data) {
        setStats({
          total: response.data.total ?? 0,
          active: response.data.active ?? 0,
          pending: response.data.pending ?? 0,
          verified: response.data.verified ?? 0,
        });
      } else {
        console.error("No stats data received");
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof WebsiteFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset page on filter change
    }));
  };

  const handleViewDetails = (website: Website) => {
    setSelectedWebsite(website);
    setShowDetails(true);
  };

  const handleWebsiteUpdate = async () => {
    await loadWebsites();
    await loadStats();
    toast.success("Website updated successfully");
  };

  const handleExportData = async () => {
    try {
      // Implement export functionality
      toast.success("Export started");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleStatusChange = async (websiteId: string) => {
    try {
      await websiteApi.toggleStatus(websiteId);
      await loadWebsites();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Websites</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all registered websites
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Websites</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Verified</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.verified}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Website List</CardTitle>
            <div className="flex gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search websites..."
                  className="pl-8 w-[250px]"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.isVerified?.toString()}
                onValueChange={(value) =>
                  handleFilterChange("isVerified", value === "true")
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setFilters({
                    search: "",
                    status: undefined,
                    category: undefined,
                    isVerified: undefined,
                    page: 1,
                    limit: ITEMS_PER_PAGE,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                  });
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
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
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : websites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No websites found
                  </TableCell>
                </TableRow>
              ) : (
                websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {website.domain}
                        <a
                          href={`https://${website.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{website.publisherId}</TableCell>
                    <TableCell>{website.category}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          website.status === "active"
                            ? "bg-green-500"
                            : website.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {website.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          website.verification?.isVerified
                            ? "default"
                            : "secondary"
                        }
                      >
                        {website.verification?.isVerified
                          ? "Verified"
                          : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(website.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleViewDetails(website)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedWebsite && (
        <WebsiteDetailsModal
          open={showDetails}
          onClose={() => setShowDetails(false)}
          website={selectedWebsite}
          onUpdate={handleWebsiteUpdate}
        />
      )}
    </div>
  );
}
