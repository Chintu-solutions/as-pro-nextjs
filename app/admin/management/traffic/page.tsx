"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Monitor, Plus, Globe, ArrowRight, Settings } from "lucide-react";
import { TrafficRuleModal } from "@/components/admin/modals/traffic-rule-modal";
import { toast } from "sonner";

const trafficRules = [
  {
    id: "1",
    sourceWebsite: "example.com",
    deviceType: "mobile",
    targetWebsite: "m.example.com",
    status: "active",
    trafficPercentage: 100,
    priority: 1,
  },
  {
    id: "2",
    sourceWebsite: "blog.com",
    deviceType: "desktop",
    targetWebsite: "newblog.com",
    status: "active",
    trafficPercentage: 50,
    priority: 2,
  },
];

export default function TrafficManagementPage() {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [filterDevice, setFilterDevice] = useState<string>("all");

  const handleAddRule = () => {
    setSelectedRule(null);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: any) => {
    setSelectedRule(rule);
    setShowRuleModal(true);
  };

  const handleSaveRule = (data: any) => {
    console.log("Save rule:", data);
    toast.success(
      selectedRule ? "Traffic rule updated" : "New traffic rule created",
      {
        description: `Rule for ${data.sourceWebsite} has been ${selectedRule ? "updated" : "created"}.`,
      }
    );
    setShowRuleModal(false);
  };

  const filteredRules = trafficRules.filter(rule => 
    filterDevice === "all" || rule.deviceType === filterDevice
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Traffic Management</h1>
        <Button onClick={handleAddRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Redirect Rule
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Traffic</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">892,456 visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop Traffic</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35%</div>
            <p className="text-xs text-muted-foreground">480,890 visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficRules.length}</div>
            <p className="text-xs text-muted-foreground">Redirect rules</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Traffic Redirect Rules</CardTitle>
            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="mobile">Mobile Only</SelectItem>
                <SelectItem value="desktop">Desktop Only</SelectItem>
                <SelectItem value="tablet">Tablet Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Source Website</TableHead>
                <TableHead>Device Type</TableHead>
                <TableHead>Target Website</TableHead>
                <TableHead>Traffic %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell className="font-medium">{rule.sourceWebsite}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {rule.deviceType === "mobile" ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <Monitor className="h-4 w-4" />
                      )}
                      {rule.deviceType.charAt(0).toUpperCase() + rule.deviceType.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {rule.targetWebsite}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>{rule.trafficPercentage}%</TableCell>
                  <TableCell>
                    <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                      {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      Edit Rule
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TrafficRuleModal
        open={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        onSubmit={handleSaveRule}
        rule={selectedRule}
      />
    </div>
  );
}