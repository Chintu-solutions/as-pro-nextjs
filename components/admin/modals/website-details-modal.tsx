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
} from "lucide-react";

interface WebsiteDetailsModalProps {
  open: boolean;
  onClose: () => void;
  website: {
    id: string;
    url: string;
    publisher: string;
    category: string;
    traffic: number;
    earnings: number;
    status: "active" | "pending" | "suspended";
    lastChecked: string;
  };
}

const performanceData = [
  { date: "2024-03-20", traffic: 2400, earnings: 240 },
  { date: "2024-03-21", traffic: 1398, earnings: 139 },
  { date: "2024-03-22", traffic: 9800, earnings: 980 },
  { date: "2024-03-23", traffic: 3908, earnings: 390 },
  { date: "2024-03-24", traffic: 4800, earnings: 480 },
  { date: "2024-03-25", traffic: 3800, earnings: 380 },
  { date: "2024-03-26", traffic: 4300, earnings: 430 },
];

export function WebsiteDetailsModal({ open, onClose, website }: WebsiteDetailsModalProps) {
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
            <div className="flex items-center gap-2">
              <span>Website Details</span>
              <a
                href={`https://${website.url}`}
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
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
                        <dt className="text-sm font-medium text-muted-foreground">URL</dt>
                        <dd>{website.url}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Publisher</dt>
                        <dd>{website.publisher}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                        <dd>{website.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Last Checked</dt>
                        <dd>{website.lastChecked}</dd>
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

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          height={50}
                          interval="preserveStartEnd"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          width={80}
                          interval="preserveStartEnd"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="traffic"
                          name="Traffic"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          name="Earnings"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
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
                        <p className="font-medium">Ad Placement Restrictions</p>
                        <p className="text-sm text-muted-foreground">Control where ads can appear</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Content Categories</p>
                        <p className="text-sm text-muted-foreground">Manage allowed ad categories</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Verification Status</p>
                        <p className="text-sm text-muted-foreground">Website ownership verification</p>
                      </div>
                      <Badge variant="secondary">Verified</Badge>
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