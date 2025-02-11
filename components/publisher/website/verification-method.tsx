import { Card } from "@/components/ui/card";
import { FileText, Globe2 } from "lucide-react";
import { VerificationMethod as VerificationMethodType } from "@/types/website";

interface VerificationMethodProps {
  selectedMethod?: VerificationMethodType;
  onMethodSelect: (method: VerificationMethodType) => Promise<void>;
  isLoading?: boolean;
}

const VERIFICATION_METHODS = [
  {
    id: "file" as const,
    title: "File Verification",
    description: "Upload a verification file to your website root directory",
    icon: FileText,
    details:
      "Best for direct website access. Create a small verification file to prove ownership.",
  },
  {
    id: "dns" as const,
    title: "DNS Verification",
    description: "Add a TXT record to your domain DNS settings",
    icon: Globe2,
    details:
      "Best for domain-level verification. Add a TXT record to your DNS configuration.",
  },
];

export function VerificationMethod({
  selectedMethod,
  onMethodSelect,
  isLoading = false,
}: VerificationMethodProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VERIFICATION_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <Card
              key={method.id}
              className={`
                cursor-pointer p-4 transition-all relative overflow-hidden
                ${
                  isSelected
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-secondary/50"
                }
                ${isLoading ? "pointer-events-none opacity-50" : ""}
              `}
              onClick={() => !isLoading && onMethodSelect(method.id)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      p-2 rounded-lg 
                      ${isSelected ? "bg-primary/10" : "bg-secondary"}
                    `}
                  >
                    <Icon
                      className={`
                        h-5 w-5
                        ${isSelected ? "text-primary" : "text-muted-foreground"}
                      `}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    text-sm border-t pt-4 mt-2
                    ${isSelected ? "text-primary/80" : "text-muted-foreground"}
                  `}
                >
                  {method.details}
                </div>
              </div>

              {isSelected && (
                <div className="absolute inset-y-0 right-0 w-1 bg-primary" />
              )}
            </Card>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Select the verification method that works best for your setup. Both
          methods provide the same level of security.
        </p>
      </div>
    </div>
  );
}
