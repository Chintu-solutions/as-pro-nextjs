import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Copy, CheckCircle, ExternalLink } from "lucide-react";
import {
  VerificationMethod,
  VerificationDetails,
  DNSRecord,
  FileVerification,
} from "@/types/website";
import { workerData } from "node:worker_threads";

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
  console.log("VerificationInstructions props:", { method, domain, details });

  if (!details) {
    return <p className="text-red-500">Verification details not available.</p>;
  }

  if (method === "dns") {
    return (
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold">DNS Verification Instructions</h2>
        <p>Add the following TXT record to your DNS settings:</p>
        <div className="mt-2 p-2 bg-white border rounded">
          <p>
            <strong>Host/Name:</strong> {details.host}
          </p>
          <p>
            <strong>Value/Content:</strong> {details.value}
          </p>
        </div>
        <ul className="mt-4 text-sm list-disc list-inside">
          {details.instructions.map(
            (
              instruction:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | PromiseLikeOfReactNode
                | null
                | undefined,
              index: Key | null | undefined
            ) => (
              <li key={index}>{instruction}</li>
            )
          )}
        </ul>
      </div>
    );
  }

  if (method === "file" && details.file) {
    return <FileInstructions file={details.file} domain={domain} />;
  }

  return <p className="text-red-500">Invalid verification method.</p>;
}
