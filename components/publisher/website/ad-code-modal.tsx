"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { AlertCircle, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

interface AdCodeModalProps {
  open: boolean;
  onClose: () => void;
  websiteId: string;
}

export function AdCodeModal({ open, onClose, websiteId }: AdCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const scriptCode = `<script src="https://cdn.adnetwork.com/script.js" data-website-id="${websiteId}"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">
            Implementation Instructions
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Warning Alert */}
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Place this script in your website&apos;s{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded">
                &lt;head&gt;
              </code>{" "}
              section for optimal performance
            </AlertDescription>
          </Alert>

          {/* Code Section */}
          <Card className="relative">
            <div className="absolute top-0 right-0 p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 px-3 hover:bg-secondary"
              >
                {copied ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Copied!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">Copy code</span>
                  </div>
                )}
              </Button>
            </div>
            <pre className="p-4 pt-12 bg-secondary/50 rounded-lg overflow-x-auto font-mono text-sm">
              <code className="break-all whitespace-pre-wrap">
                {scriptCode}
              </code>
            </pre>
          </Card>

          {/* Implementation Guide */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              Implementation Guide
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </h4>

            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Step 1: Add the Script</h5>
                  <p className="text-sm text-muted-foreground">
                    Copy the code above and paste it into your website&apos;s
                    HTML file, specifically within the{" "}
                    <code className="bg-secondary px-1.5 py-0.5 rounded">
                      &lt;head&gt;
                    </code>{" "}
                    section.
                  </p>
                </div>

                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">
                    Step 2: Verify Implementation
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    After adding the script, save your changes and deploy them
                    to your website. Our system will automatically detect the
                    script within 24 hours.
                  </p>
                </div>

                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Step 3: Testing</h5>
                  <p className="text-sm text-muted-foreground">
                    Once implemented, you can verify the script is working by
                    checking your website&apos;s console for any errors or
                    visiting your dashboard for status updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={onClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
