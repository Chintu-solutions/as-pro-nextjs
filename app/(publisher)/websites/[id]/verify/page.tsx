"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  VerificationMethod,
  VerificationInstructions,
  VerificationStatus,
} from "@/components/publisher/website";

import type {
  Website,
  VerificationMethod as VerificationMethodType,
  VerificationState,
  VerificationCheckResponse,
  ApiResponse,
} from "@/types/website";

import {
  websiteApi,
  WebsiteApiError,
  isVerificationSuccess,
} from "@/lib/api/publisher/website";

const VERIFICATION_STEPS = [
  {
    id: "method",
    label: "Choose Method",
    description: "Select your preferred verification method",
  },
  {
    id: "instructions",
    label: "Follow Instructions",
    description: "Complete the verification requirements",
  },
  {
    id: "verify",
    label: "Verify Ownership",
    description: "Confirm website ownership",
  },
] as const;

interface VerificationPageProps {
  params: {
    id: string;
  };
}

function LoadingSkeleton() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-[400px] bg-muted rounded" />
      </div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="container max-w-4xl py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const progressPercentage =
    ((currentStep + 1) / VERIFICATION_STEPS.length) * 100;

  return (
    <div className="mb-8">
      <Progress value={progressPercentage} className="mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {VERIFICATION_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`text-sm ${
              index === currentStep ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <p className="font-medium">{step.label}</p>
            <p className="text-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VerificationPage({ params }: VerificationPageProps) {
  const router = useRouter();

  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      currentStep: 0,
      method: "file",
      details: null,
      status: "idle",
      error: null,
      attempts: 0,
      remainingAttempts: 3,
    }
  );

  // Fetch website data with proper typing
  const { data: response, error: websiteError } = useSWR<
    ApiResponse<Website>,
    WebsiteApiError
  >(`/websites/${params.id}`, () => websiteApi.getWebsite(params.id));

  const { currentStep, method, details, status, error } = verificationState;

  const handleMethodSelect = async (selectedMethod: VerificationMethodType) => {
    try {
      setVerificationState((prev) => ({
        ...prev,
        status: "initializing",
        error: null,
      }));

      const response = await websiteApi.verification.initiate(
        params.id,
        selectedMethod
      );
      console.log(response, "----------------> response for Initiate");
      if (isVerificationSuccess(response)) {
        setVerificationState((prev) => ({
          ...prev,
          method: selectedMethod,
          details: response.data.verificationDetails,
          currentStep: 1,
          status: "idle",
        }));

        toast.success("Verification instructions generated");
      } else {
        throw new Error(
          response.message || "Failed to initialize verification"
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to initialize verification";
      setVerificationState((prev) => ({
        ...prev,
        status: "error",
        error: message,
      }));
      toast.error(message);
    }
  };

  const handleVerificationCheck = async () => {
    try {
      setVerificationState((prev) => ({
        ...prev,
        status: "checking",
        error: null,
      }));

      const response = await websiteApi.verification.checkStatus(params.id);

      if (response.success && response.status === "verified") {
        handleVerificationSuccess();
      } else {
        handleVerificationFailure(response);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to check verification";
      handleError(message);
    }
  };

  const handleVerificationSuccess = () => {
    setVerificationState((prev) => ({
      ...prev,
      status: "success",
    }));
    toast.success("Website verified successfully!");
    setTimeout(() => router.push("/websites"), 2000);
  };

  const handleVerificationFailure = (response: VerificationCheckResponse) => {
    const attempts = response.attempts || { count: 0, remaining: 0 };
    setVerificationState((prev) => ({
      ...prev,
      status: "error",
      error: response.message || "Verification failed",
      attempts: attempts.count,
      remainingAttempts: attempts.remaining,
    }));

    toast.error(
      attempts.remaining > 0
        ? `Verification failed. ${attempts.remaining} attempts remaining`
        : "Verification failed. No attempts remaining"
    );
  };

  const handleError = (message: string) => {
    setVerificationState((prev) => ({
      ...prev,
      status: "error",
      error: message,
    }));
    toast.error(message);
  };

  if (websiteError) {
    return (
      <ErrorDisplay
        message={
          websiteError instanceof WebsiteApiError
            ? websiteError.message
            : "Failed to load website details"
        }
      />
    );
  }

  if (!response?.success || !response.data) {
    return <LoadingSkeleton />;
  }

  const website = response.data;

  if (website.status === "active") {
    toast.success("Website is already verified");
    router.push("/websites");
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="gap-2 mb-4"
          onClick={() => router.push("/websites")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Websites
        </Button>

        <h1 className="text-2xl font-bold mb-2">Verify Website Ownership</h1>
        <p className="text-muted-foreground">
          Complete the verification process for {website.domain}
        </p>
      </div>

      <ProgressIndicator currentStep={currentStep} />

      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <VerificationMethod
              selectedMethod={method}
              onMethodSelect={handleMethodSelect}
              isLoading={status === "initializing"}
            />
          )}

          {currentStep === 1 && details && (
            <div className="space-y-6">
              <VerificationInstructions
                method={method}
                domain={website.domain}
                details={details}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    setVerificationState((prev) => ({
                      ...prev,
                      currentStep: 2,
                    }))
                  }
                >
                  Continue to Verification
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <VerificationStatus
                status={status}
                error={error}
                attempts={{
                  count: verificationState.attempts,
                  remaining: verificationState.remainingAttempts,
                }}
                onRetry={handleVerificationCheck}
              />
              {status === "idle" && (
                <div className="flex justify-end">
                  <Button onClick={handleVerificationCheck}>
                    Verify Website
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
