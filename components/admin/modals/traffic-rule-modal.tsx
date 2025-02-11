"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TrafficRuleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  rule?: {
    id: string;
    sourceWebsite: string;
    deviceType: string;
    targetWebsite: string;
    status: string;
    trafficPercentage: number;
    priority: number;
  } | null;
}

export function TrafficRuleModal({
  open,
  onClose,
  onSubmit,
  rule,
}: TrafficRuleModalProps) {
  const [formData, setFormData] = useState({
    sourceWebsite: rule?.sourceWebsite || "",
    deviceType: rule?.deviceType || "all",
    targetWebsite: rule?.targetWebsite || "",
    trafficPercentage: rule?.trafficPercentage || 100,
    priority: rule?.priority || 1,
    status: rule?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {rule ? "Edit Traffic Rule" : "Create Traffic Rule"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceWebsite">Source Website</Label>
              <Input
                id="sourceWebsite"
                placeholder="example.com"
                value={formData.sourceWebsite}
                onChange={(e) =>
                  setFormData({ ...formData, sourceWebsite: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceType">Device Type</Label>
              <Select
                value={formData.deviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, deviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="mobile">Mobile Only</SelectItem>
                  <SelectItem value="desktop">Desktop Only</SelectItem>
                  <SelectItem value="tablet">Tablet Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetWebsite">Target Website</Label>
            <Input
              id="targetWebsite"
              placeholder="target-site.com"
              value={formData.targetWebsite}
              onChange={(e) =>
                setFormData({ ...formData, targetWebsite: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trafficPercentage">Traffic Percentage</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="trafficPercentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.trafficPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trafficPercentage: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value),
                  })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers have higher priority
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Rules are processed in order of priority. Only the first matching rule will be applied.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rule Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this redirect rule
              </p>
            </div>
            <Switch
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  status: checked ? "active" : "inactive",
                })
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {rule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}