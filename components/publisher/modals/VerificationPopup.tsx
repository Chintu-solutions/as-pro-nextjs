"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authApi } from "@/lib/api/publisher/auth";
import type { AxiosError } from "axios";

interface VerificationPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  email: string;
  onSuccess?: () => void;
}

interface APIErrorData {
  success: boolean;
  message: string;
}

export default function VerificationPopup({
  isOpen,
  setIsOpen,
  email,
  onSuccess,
}: VerificationPopupProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "") // Allow A-Z and 0-9
      .slice(0, 6);
    setCode(value);
  };

  async function onVerify(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.verifyEmail({ email, code });

      if (response.success) {
        toast.success(response.message || "Email verified successfully!");
        onSuccess?.();
        setIsOpen(false);
        router.push("/login"); // Redirect to login instead of dashboard
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorData>;
      if (axiosError.response?.status === 429) {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(
          axiosError.response?.data?.message ||
            "Invalid verification code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setCode(""); // Reset code when dialog closes
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-base">
            Please enter the verification code sent to {email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-base">
              Verification Code
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="VJNYFE"
                required
                value={code}
                onChange={handleCodeChange}
                disabled={isLoading}
                className="pl-10 h-12 tracking-[0.75em] text-center uppercase font-mono text-base"
                maxLength={6}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify Email"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
