"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Loader2,
} from "lucide-react";
import { publisherApi } from "@/lib/api/admin/publisher";
import type { Publisher, PublisherStats } from "@/types/publishers";
import { toast } from "sonner";

interface PublisherDetailsModalProps {
  open: boolean;
  onClose: () => void;
  publisher: Publisher;
  onUpdate: () => void;
}

export function PublisherDetailsModal({
  open,
  onClose,
  publisher,
  onUpdate,
}: PublisherDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<
    "suspend" | "delete" | "activate" | null
  >(null);
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await publisherApi.getPublisherStats(publisher.id);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error(publisherApi.handleError(error));
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleAction = async (action: "suspend" | "delete" | "activate") => {
    setActionType(action);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    try {
      if (actionType === "delete") {
        await publisherApi.deletePublisher(publisher.id);
        toast.success("Publisher deleted successfully");
        onClose();
        onUpdate();
      } else {
        await publisherApi.toggleStatus(publisher.id);
        toast.success(
          actionType === "suspend"
            ? "Publisher suspended successfully"
            : "Publisher activated successfully"
        );
        onUpdate();
      }
    } catch (error) {
      toast.error(publisherApi.handleError(error));
    } finally {
      setLoading(false);
      setShowConfirmation(false);
      setActionType(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              Publisher Details
            </span>
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
          </DialogTitle>
        </DialogHeader>

        {showConfirmation ? (
          <div className="p-6 space-y-4">
            <Alert variant="destructive" className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">
                {actionType === "suspend"
                  ? "Are you sure you want to suspend this publisher? All their websites will be temporarily disabled."
                  : actionType === "delete"
                  ? "Are you sure you want to delete this publisher? This action cannot be undone."
                  : "Are you sure you want to reactivate this publisher's account?"}
              </AlertDescription>
            </Alert>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={loading}
                className={`min-w-[100px] ${
                  actionType === "activate"
                    ? "bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800"
                    : "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs
            defaultValue="overview"
            className="w-full"
            onValueChange={(value) => {
              if (value === "overview" && !stats) {
                loadStats();
              }
            }}
          >
            <TabsList className="w-full px-6">
              <TabsTrigger value="overview" className="flex-1">
                Overview
              </TabsTrigger>
              <TabsTrigger value="websites" className="flex-1">
                Websites
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex-1">
                Earnings
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                Security
              </TabsTrigger>
            </TabsList>

            <div className="px-6 py-4">
              <TabsContent value="overview">
                <div className="grid gap-6">
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : stats ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Active Websites
                          </CardTitle>
                          <Globe className="h-4 w-4 text-slate-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {stats.activeWebsites}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Revenue
                          </CardTitle>
                          <LineChart className="h-4 w-4 text-slate-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            ${stats.totalRevenue.toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Traffic
                          </CardTitle>
                          <BarChart className="h-4 w-4 text-slate-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {stats.totalTraffic.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Performance Score
                          </CardTitle>
                          <Users className="h-4 w-4 text-slate-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900">
                            {stats.performanceScore}%
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Failed to load statistics
                    </div>
                  )}

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        Account Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {publisher.status === "active" ? (
                        <Button
                          onClick={() => handleAction("suspend")}
                          className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Account
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAction("activate")}
                          className="w-full bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Account
                        </Button>
                      )}
                      <Button
                        onClick={() => handleAction("delete")}
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="websites">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Website Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Website management coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="earnings">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Payment history coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Security Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Security controls coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
