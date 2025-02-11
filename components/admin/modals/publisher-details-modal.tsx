"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  BarChart,
  Users,
  Globe,
  AlertTriangle,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
} from "lucide-react";

interface PublisherDetailsModalProps {
  open: boolean;
  onClose: () => void;
  publisher: {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    websites: number;
    totalEarnings: number;
    status: "active" | "pending" | "suspended";
  };
}

export function PublisherDetailsModal({ open, onClose, publisher }: PublisherDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "delete" | "activate" | null>(null);

  const handleAction = async (action: "suspend" | "delete" | "activate") => {
    setActionType(action);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    // Add action logic here based on actionType
    setTimeout(() => {
      setLoading(false);
      setShowConfirmation(false);
      setActionType(null);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Publisher Details</span>
            <Badge
              variant={
                publisher.status === "active"
                  ? "default"
                  : publisher.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="ml-2"
            >
              {publisher.status.charAt(0).toUpperCase() + publisher.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {showConfirmation ? (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {actionType === "suspend"
                  ? "Are you sure you want to suspend this publisher? All their websites will be temporarily disabled."
                  : actionType === "delete"
                  ? "Are you sure you want to delete this publisher? This action cannot be undone."
                  : "Are you sure you want to reactivate this publisher's account?"}
              </AlertDescription>
            </Alert>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmAction}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="websites">Websites</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Status</CardTitle>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        publisher.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : publisher.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {publisher.status.charAt(0).toUpperCase() + publisher.status.slice(1)}
                      </div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Websites</CardTitle>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{publisher.websites}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${publisher.totalEarnings.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Join Date</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{new Date(publisher.joinDate).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {publisher.status === "active" ? (
                        <Button
                          variant="destructive"
                          onClick={() => handleAction("suspend")}
                          className="w-full"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Account
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => handleAction("activate")}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Account
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleAction("delete")}
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="websites">
              <Card>
                <CardHeader>
                  <CardTitle>Website Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">example.com</p>
                        <p className="text-sm text-muted-foreground">Added on 2024-03-20</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Lock className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">myblog.com</p>
                        <p className="text-sm text-muted-foreground">Added on 2024-03-15</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Lock className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">March 2024 Payout</p>
                        <p className="text-sm text-muted-foreground">Processed on 2024-03-25</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$3,456.78</p>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">February 2024 Payout</p>
                        <p className="text-sm text-muted-foreground">Processed on 2024-02-25</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$2,890.45</p>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Extra security for account access</p>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Login History</p>
                        <p className="text-sm text-muted-foreground">Recent account access</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Force Password Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}