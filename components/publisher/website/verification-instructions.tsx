"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Copy, CheckCircle, ExternalLink } from "lucide-react";
import type {
  VerificationMethod,
  VerificationDetails,
  FileVerification,
  FileDetails,
  DNSRecord,
  DNSDetails,
} from "@/types/website";

interface VerificationInstructionsProps {
  method: VerificationMethod;
  domain: string;
  details: VerificationDetails;
}

interface CopyableFieldProps {
  label: string;
  value: string;
  fieldId: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => Promise<void>;
}

function CopyableField({
  label,
  value,
  fieldId,
  copiedField,
  onCopy,
}: CopyableFieldProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
          {value}
        </code>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onCopy(value, fieldId)}
        >
          {copiedField === fieldId ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function DNSInstructions({
  record,
  domain,
}: {
  record: DNSRecord;
  domain: string;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Add the following TXT record to your domain&apos;s DNS settings
        </AlertDescription>
      </Alert>

      <Card className="divide-y">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <CopyableField
              label="Record Type"
              value={record.type}
              fieldId="type"
              copiedField={copiedField}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Name/Host"
              value={record.name}
              fieldId="name"
              copiedField={copiedField}
              onCopy={handleCopy}
            />
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Value</p>
          <div className="relative">
            <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-sm">
              {record.value}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => handleCopy(record.value, "value")}
            >
              {copiedField === "value" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>Important notes:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>DNS changes can take up to 24 hours to propagate</li>
          <li>Make sure to copy the record exactly as shown</li>
          <li>
            Some DNS providers may require you to remove the domain from the
            record name
          </li>
        </ul>
      </div>
    </div>
  );
}

function FileInstructions({
  file,
  domain,
}: {
  file: FileVerification;
  domain: string;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Create a verification file at the following location
        </AlertDescription>
      </Alert>

      <Card className="divide-y">
        <div className="p-4">
          <CopyableField
            label="File Path"
            value={file.path}
            fieldId="path"
            copiedField={copiedField}
            onCopy={handleCopy}
          />
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-1">File Content</p>
          <div className="relative">
            <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-sm">
              {file.content}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => handleCopy(file.content, "content")}
            >
              {copiedField === "content" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            The verification file should be accessible at:
          </p>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
              {file.fullUrl}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(file.fullUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>Important notes:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>The file must be accessible via HTTP/HTTPS</li>
            <li>
              The file content must match exactly (no extra spaces or line
              breaks)
            </li>
            <li>
              Some hosting providers may require a short time for the file to be
              visible
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export function VerificationInstructions({
  method,
  domain,
  details,
}: VerificationInstructionsProps) {
  console.log("Verification Props:", { method, domain, details });

  // For DNS method
  if (method === "dns") {
    console.log("DNS Method Selected");
    console.log("DNS Details:", details);

    // Type guard to check if details matches DNSDetails structure
    const isDNSDetails = (details: any): details is DNSDetails => {
      return (
        details &&
        typeof details.type === "string" &&
        typeof details.host === "string" &&
        typeof details.value === "string" &&
        method === "dns"
      );
    };

    if (isDNSDetails(details)) {
      // Create the properly typed DNSRecord
      const dnsRecord: DNSRecord = {
        type: details.type,
        name: details.host,
        value: details.value,
      };

      console.log("Mapped DNS Record:", dnsRecord);
      return <DNSInstructions record={dnsRecord} domain={domain} />;
    }

    console.log("DNS Record is missing or invalid");
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          DNS verification details are missing. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // For File method
  if (method === "file") {
    console.log("File Method Selected");
    console.log("File Details:", details);

    // Type guard for file details
    const isFileDetails = (details: any): details is FileDetails => {
      return (
        details &&
        typeof details.path === "string" &&
        typeof details.content === "string" &&
        method === "file"
      );
    };

    if (isFileDetails(details)) {
      // Map to expected file verification structure
      const fileVerification: FileVerification = {
        path: details.path,
        content: details.content,
        fullUrl: `https://${domain}${details.path}`,
      };

      console.log("Mapped File Verification:", fileVerification);
      return <FileInstructions file={fileVerification} domain={domain} />;
    }

    console.log("File details are missing");
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          File verification details are missing. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  console.log("Invalid method or unhandled case:", { method, details });
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Invalid verification method. Please select either DNS or File
        verification.
      </AlertDescription>
    </Alert>
  );
}
