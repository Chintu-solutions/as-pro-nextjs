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
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Globe,
  AlertTriangle,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
  ExternalLink,
  AlertOctagon,
  ShieldCheck,
} from "lucide-react";
import { websiteApi } from "@/lib/api/admin/website";
import { toast } from "sonner";
import type { Website } from "@/types/website";

interface WebsiteDetailsModalProps {
  open: boolean;
  onClose: () => void;
  website: Website;
  onUpdate: () => void;
}

type ActionType = "suspend" | "delete" | "activate" | "verify" | "reject";

export function WebsiteDetailsModal({
  open,
  onClose,
  website,
  onUpdate,
}: WebsiteDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const handleAction = async (action: ActionType) => {
    setActionType(action);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    try {
      setLoading(true);

      switch (actionType) {
        case "suspend":
        case "activate":
          await websiteApi.toggleStatus(website.id);
          toast.success(
            `Website \${actionType === "activate" ? "activated" : "suspended"} successfully`
          );
          break;

        case "delete":
          await websiteApi.deleteWebsite(website.id);
          toast.success("Website deleted successfully");
          break;

        case "verify":
          await websiteApi.manageVerification(website.id, "approve");
          toast.success("Website verified successfully");
          break;

        case "reject":
          await websiteApi.manageVerification(website.id, "reject");
          toast.success("Website verification rejected");
          break;
      }

      onUpdate();
      setShowConfirmation(false);
      setActionType(null);
      onClose();
    } catch (error) {
      toast.error("Failed to perform action");
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (website.verification?.isVerified) {
      return <Badge variant="default">Verified</Badge>;
    }
    if (website.verification?.attempts > 0) {
      return <Badge variant="destructive">Verification Attempted</Badge>;
    }
    return <Badge variant="secondary">Not Verified</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Website Details</span>
              <a
                href={`https://${website.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
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
              {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {showConfirmation ? (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {actionType === "suspend"
                  ? "Are you sure you want to suspend this website? All ads will be temporarily disabled."
                  : actionType === "delete"
                  ? "Are you sure you want to delete this website? This action cannot be undone."
                  : actionType === "verify"
                  ? "Are you sure you want to verify this website?"
                  : actionType === "reject"
                  ? "Are you sure you want to reject this website's verification?"
                  : "Are you sure you want to reactivate this website?"}
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
                variant={actionType === "delete" ? "destructive" : "default"}
                onClick={confirmAction}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Domain
                        </dt>
                        <dd>{website.domain}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Publisher ID
                        </dt>
                        <dd>{website.publisherId}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Category
                        </dt>
                        <dd>{website.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Created At
                        </dt>
                        <dd>
                          {new Date(website.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Management Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {website.status === "active" ? (
                        <Button
                          variant="destructive"
                          onClick={() => handleAction("suspend")}
                          className="w-full"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Website
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => handleAction("activate")}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Website
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleAction("delete")}
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {website.verification?.isVerified ? (
                          <ShieldCheck className="h-8 w-8 text-green-500" />
                        ) : (
                          <AlertOctagon className="h-8 w-8 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">Current Status</p>
                          <p className="text-sm text-muted-foreground">
                            {getVerificationStatus()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {website.verification?.attempts > 0 && (
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium">Verification Attempts</p>
                        <p className="text-sm text-muted-foreground">
                          Total attempts: {website.verification.attempts}
                        </p>
                        {website.verification.lastAttempt && (
                          <p className="text-sm text-muted-foreground">
                            Last attempt:{" "}
                            {new Date(
                              website.verification.lastAttempt
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!website.verification?.isVerified && (
                        <Button
                          variant="default"
                          onClick={() => handleAction("verify")}
                          className="flex-1"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Approve Verification
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleAction("reject")}
                        className="flex-1"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reject Verification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Website Status</p>
                        <p className="text-sm text-muted-foreground">
                          {website.status.charAt(0).toUpperCase() +
                            website.status.slice(1)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          website.status === "active" ? "secondary" : "default"
                        }
                      >
                        {website.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Verification Status</p>
                        <p className="text-sm text-muted-foreground">
                          Website ownership verification
                        </p>
                      </div>
                      {getVerificationStatus()}
                    </div>
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
