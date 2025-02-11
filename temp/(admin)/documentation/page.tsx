"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  Code,
  FileText,
  Search,
  Terminal,
  Webhook,
  Shield,
  Settings,
  Download,
} from "lucide-react";

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="api-reference">API Reference</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Welcome to AdNetwork</h3>
                <p className="text-muted-foreground">
                  This documentation will help you understand how to use and manage the AdNetwork
                  platform effectively. Whether you're managing publishers, handling payments, or
                  analyzing performance, you'll find comprehensive guides and references here.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Quick Start</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Platform overview</li>
                        <li>• Dashboard navigation</li>
                        <li>• Basic configurations</li>
                        <li>• Publisher management</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Real-time analytics</li>
                        <li>• Payment processing</li>
                        <li>• Traffic management</li>
                        <li>• Security controls</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  System Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Browser Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Chrome (latest 2 versions)</li>
                      <li>• Firefox (latest 2 versions)</li>
                      <li>• Safari (latest 2 versions)</li>
                      <li>• Edge (latest 2 versions)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Required Permissions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Admin access</li>
                      <li>• API credentials</li>
                      <li>• Payment system access</li>
                      <li>• Analytics permissions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-reference">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our RESTful API allows you to programmatically access and manage your AdNetwork
                  data. Use these endpoints to integrate with your existing systems.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Authentication</h4>
                      <pre className="bg-muted p-4 rounded-lg text-sm">
                        <code>
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </pre>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Base URL</h4>
                      <pre className="bg-muted p-4 rounded-lg text-sm">
                        <code>
                          https://api.adnetwork.com/v1
                        </code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Publishers</h4>
                    <div className="space-y-2 text-sm">
                      <pre className="bg-muted p-2 rounded">GET /publishers</pre>
                      <pre className="bg-muted p-2 rounded">POST /publishers</pre>
                      <pre className="bg-muted p-2 rounded">GET /publishers/{"{id}"}</pre>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Payments</h4>
                    <div className="space-y-2 text-sm">
                      <pre className="bg-muted p-2 rounded">GET /payments</pre>
                      <pre className="bg-muted p-2 rounded">POST /payments/process</pre>
                      <pre className="bg-muted p-2 rounded">GET /payments/history</pre>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Analytics</h4>
                    <div className="space-y-2 text-sm">
                      <pre className="bg-muted p-2 rounded">GET /analytics/overview</pre>
                      <pre className="bg-muted p-2 rounded">GET /analytics/traffic</pre>
                      <pre className="bg-muted p-2 rounded">GET /analytics/revenue</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Publisher Management</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Regular verification checks</li>
                        <li>• Clear communication channels</li>
                        <li>• Performance monitoring</li>
                        <li>• Compliance enforcement</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Payment Processing</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Automated scheduling</li>
                        <li>• Fraud prevention</li>
                        <li>• Documentation requirements</li>
                        <li>• Payment verification</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Traffic Management</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Implement these practices to ensure optimal traffic distribution and quality:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Regular monitoring of traffic patterns</li>
                        <li>2. Implementation of fraud detection systems</li>
                        <li>3. Optimization of ad placement and targeting</li>
                        <li>4. Performance tracking and reporting</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Custom Integrations</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to integrate AdNetwork with your existing systems and workflows.
                    </p>
                    <Button variant="outline">View Integration Guide</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Automation</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up automated processes for routine tasks and reporting.
                    </p>
                    <Button variant="outline">View Automation Guide</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Access Control</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Role-based permissions</li>
                        <li>• Two-factor authentication</li>
                        <li>• Session management</li>
                        <li>• IP whitelisting</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Data Protection</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Encryption standards</li>
                        <li>• Backup procedures</li>
                        <li>• Privacy compliance</li>
                        <li>• Audit logging</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Security Checklist</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Follow these security measures to protect your AdNetwork installation:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Regular security audits</li>
                        <li>2. Strong password policies</li>
                        <li>3. API key rotation</li>
                        <li>4. Monitoring and alerts</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}