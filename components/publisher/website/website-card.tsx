import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Code, ExternalLink, AlertCircle } from "lucide-react";
import type { Website } from "@/types/website";

interface WebsiteCardProps {
  website: Website & { id: string }; // Ensure id is always present
  onViewScript: () => void;
  onVerify: () => void;
}

interface StatusConfig {
  variant: "success" | "warning" | "destructive";
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: JSX.Element;
}

function getStatusConfig(status: Website["status"]): StatusConfig {
  const configs: Record<Website["status"], StatusConfig> = {
    active: {
      variant: "success",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      icon: <Globe className="h-4 w-4 text-green-500" />,
    },
    pending: {
      variant: "warning",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
    },
    rejected: {
      variant: "destructive",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    },
  };

  return configs[status];
}

export function WebsiteCard({
  website,
  onViewScript,
  onVerify,
}: WebsiteCardProps) {
  const statusConfig = getStatusConfig(website.status);

  const renderActions = () => {
    if (website.status === "pending") {
      return (
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${statusConfig.textColor}`}>
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Verification required</span>
          </div>
          <Button variant="default" size="sm" onClick={onVerify}>
            Verify Now
          </Button>
        </div>
      );
    }

    if (website.status === "active") {
      return (
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={onViewScript}
        >
          <Code className="h-4 w-4" />
          View Ad Code
        </Button>
      );
    }

    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-secondary rounded-md">
              <Globe className="h-5 w-5" />
            </div>
            <span className="font-semibold">{website.domain}</span>
            <ExternalLink
              className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => window.open(`https://${website.domain}`, "_blank")}
            />
          </CardTitle>
          <CardDescription>
            Added on {new Date(website.createdAt).toLocaleDateString()}
            {website.category && ` • ${website.category}`}
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className={`flex items-center gap-1.5 px-3 py-1 
            ${statusConfig.bgColor} 
            ${statusConfig.textColor} 
            ${statusConfig.borderColor}`}
        >
          {statusConfig.icon}
          {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center">
          {renderActions()}
        </div>
      </CardContent>
    </Card>
  );
}
