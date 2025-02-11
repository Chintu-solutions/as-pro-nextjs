"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Payment Processed",
    message: "Your payout of $3,456.78 has been processed",
    type: "success",
    date: "2024-03-25 14:30",
    read: false,
  },
  {
    id: 2,
    title: "New Performance Milestone",
    message: "Congratulations! Your website has reached 100k visitors",
    type: "achievement",
    date: "2024-03-24 09:15",
    read: false,
  },
  {
    id: 3,
    title: "Security Alert",
    message: "New login detected from an unknown device",
    type: "warning",
    date: "2024-03-23 18:45",
    read: true,
  },
  {
    id: 4,
    title: "Website Verification",
    message: "Your website example.com has been verified",
    type: "success",
    date: "2024-03-22 11:20",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
            <CardContent className="flex items-start p-6">
              <div className="mr-4">
                {notification.type === "success" && (
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {notification.type === "warning" && (
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                )}
                {notification.type === "achievement" && (
                  <div className="p-2 bg-blue-100 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{notification.title}</h3>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Badge variant="secondary">New</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {notification.date}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">{notification.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}