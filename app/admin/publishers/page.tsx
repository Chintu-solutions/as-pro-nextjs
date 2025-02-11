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
import { PublisherDetailsModal } from "@/components/admin/modals/publisher-details-modal";
import { Search, Download } from "lucide-react";

const publishers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    websites: 3,
    totalEarnings: 12345.67,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    websites: 2,
    totalEarnings: 8901.23,
    status: "pending",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    websites: 1,
    totalEarnings: 4567.89,
    status: "suspended",
    joinDate: "2024-03-10",
  },
];

export default function PublishersPage() {
  const [selectedPublisher, setSelectedPublisher] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (publisher: any) => {
    setSelectedPublisher(publisher);
    setShowDetails(true);
  };

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
                <TableHead>Websites</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishers.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell className="font-medium">{publisher.name}</TableCell>
                  <TableCell>{publisher.email}</TableCell>
                  <TableCell>{publisher.websites}</TableCell>
                  <TableCell>${publisher.totalEarnings.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        publisher.status === "active"
                          ? "default"
                          : publisher.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {publisher.status.charAt(0).toUpperCase() + publisher.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{publisher.joinDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(publisher)}
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

      {selectedPublisher && (
        <PublisherDetailsModal
          open={showDetails}
          onClose={() => setShowDetails(false)}
          publisher={selectedPublisher}
        />
      )}
    </div>
  );
}