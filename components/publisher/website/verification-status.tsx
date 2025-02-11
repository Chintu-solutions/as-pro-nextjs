import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  XCircle,
  Clock,
} from "lucide-react";
import { UIVerificationStatus } from "@/types/website";

interface VerificationStatusProps {
  status: UIVerificationStatus;
  error?: string | null;
  attempts: {
    count: number;
    remaining: number;
    nextAttemptAt?: string;
  };
  onRetry?: () => Promise<void>;
}

export function VerificationStatus({
  status,
  error,
  attempts,
  onRetry,
}: VerificationStatusProps) {
  const renderSuccessState = () => (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          Verification Successful
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Your website has been verified successfully. You will be redirected to
          implement the ad code.
        </AlertDescription>
      </Alert>

      <Card className="bg-green-50 border-green-200 p-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Next Steps</h4>
            <p className="text-sm text-green-700">
              You will be redirected to view your ad implementation code.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCheckingState = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-medium mb-2">Verifying Your Website</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
            We&apos;re checking your verification configuration. This may take a
            few moments.
          </p>
          <Progress value={100} className="w-full max-w-xs animate-pulse" />
        </div>
      </Card>
    </div>
  );

  const renderErrorState = () => {
    if (!error) return null;

    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        {attempts && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Remaining attempts</span>
                </div>
                <span className="font-medium">
                  {attempts.remaining} of {attempts.count + attempts.remaining}
                </span>
              </div>

              {attempts.nextAttemptAt && (
                <div className="text-sm text-muted-foreground">
                  Next attempt available:{" "}
                  {new Date(attempts.nextAttemptAt).toLocaleString()}
                </div>
              )}

              {attempts.remaining > 0 && onRetry && (
                <div className="flex justify-end">
                  <Button variant="outline" onClick={onRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p>Common verification issues:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>DNS records may take up to 24 hours to propagate</li>
            <li>Verification file might not be in the correct location</li>
            <li>Content may not match exactly (check for extra spaces)</li>
            <li>Website might not be accessible</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderIdleState = () => (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
        <div>
          <h3 className="text-lg font-medium mb-2">Ready to Verify</h3>
          <p className="text-sm text-muted-foreground">
            Click the verify button when you&apos;ve completed the verification
            steps.
          </p>
        </div>
      </div>
    </Card>
  );

  switch (status) {
    case "success":
      return renderSuccessState();
    case "checking":
      return renderCheckingState();
    case "error":
      return renderErrorState();
    default:
      return renderIdleState();
  }
}
