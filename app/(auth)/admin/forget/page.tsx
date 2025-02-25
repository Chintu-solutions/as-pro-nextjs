"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Loader2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api/admin/auth";
import type { AxiosError } from "axios";

interface APIErrorData {
  success: boolean;
  message: string;
}

type Step = "email" | "verify" | "reset";

interface FormData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

interface CustomResponse extends Response {
  success: boolean;
}

export default function AdminForgetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    setFormData((prev) => ({ ...prev, code: value }));
  };

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword(formData.email);
      if (response.success) {
        toast.success(response.message || "Verification code sent!");
        setCurrentStep("verify");
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorData>;
      if (axiosError.response?.status === 404) {
        toast.error("Admin email address not found");
      } else {
        toast.error(
          axiosError.response?.data?.message ||
            "Failed to send code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!isLoading) {
      await handleSendCode(new Event("submit") as any);
    }
  }

  async function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = (await authApi.verifyPasswordCode({
        email: formData.email,
        code: formData.code,
      })) as CustomResponse;

      if (response.success) {
        toast.success("Code verified successfully!");
        setCurrentStep("reset");
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorData>;
      if (axiosError.response?.status === 429) {
        toast.error("Too many attempts. Please try again later.");
      } else if (axiosError.response?.status === 400) {
        toast.error("Invalid or expired code. Please try again.");
      } else {
        toast.error(
          axiosError.response?.data?.message ||
            "Invalid code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        toast.success(response.message || "Password reset successfully!");
        router.push("/admin/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorData>;
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={isLoading}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base bg-gradient-to-r from-slate-900 to-indigo-900 text-white hover:from-slate-800 hover:to-indigo-800 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Code"
              )}
            </Button>
          </form>
        );

      case "verify":
        return (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-base">
                Verification Code
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="VJNYFE"
                  required
                  value={formData.code}
                  onChange={handleCodeChange}
                  disabled={isLoading}
                  className="pl-10 h-12 tracking-[0.75em] text-center uppercase font-mono text-base"
                  maxLength={6}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Enter the 6-character code sent to {formData.email}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading || formData.code.length !== 6}
                className="w-full h-12 text-base bg-gradient-to-r from-slate-900 to-indigo-900 text-white hover:from-slate-800 hover:to-indigo-800 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <div className="flex items-center justify-between px-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep("email")}
                  disabled={isLoading}
                  className="h-auto p-0 text-base"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="h-auto p-0 text-base"
                >
                  Resend Code
                </Button>
              </div>
            </div>
          </form>
        );

      case "reset":
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-base">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="pl-10 h-12 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base bg-gradient-to-r from-slate-900 to-indigo-900 text-white hover:from-slate-800 hover:to-indigo-800 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep("verify")}
                disabled={isLoading}
                className="w-full text-base"
              >
                Back
              </Button>
            </div>
          </form>
        );
    }
  };

  const steps = {
    email: {
      title: "Reset Admin Password",
      description:
        "Enter your admin email address to receive a verification code.",
    },
    verify: {
      title: "Verify Code",
      description: "Enter the verification code sent to your email.",
    },
    reset: {
      title: "New Password",
      description: "Enter your new admin password.",
    },
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Side */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900" />
        <div className="absolute inset-0 bg-[url('/img/admin-login.png')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-50" />

        {/* Logo */}
        <div className="relative z-20 flex items-center text-lg font-medium animate-fade-in">
          <Shield className="mr-2 h-6 w-6 animate-float" />
          <span className="text-2xl font-bold text-gradient">
            TrafficPro Admin
          </span>
        </div>

        {/* Content */}
        <div className="relative z-20 mt-auto space-y-6 animate-slide-up">
          <blockquote className="space-y-4">
            <p className="text-xl leading-relaxed">
              &quot;Powerful admin dashboard for managing publishers, monitoring
              traffic, and maintaining platform integrity with advanced
              analytics and controls.&quot;
            </p>
            <footer className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 backdrop-blur">
                <Image
                  src="/img/img.webp"
                  alt="Admin"
                  className="object-cover"
                  width={300}
                  height={300}
                />
              </div>
              <div>
                <div className="font-semibold">System Administrator</div>
                <div className="text-sm opacity-80">TrafficPro Team</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side */}
      <div className="lg:p-8 animate-fade-in">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-base">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link
              href="/admin/login"
              className="text-primary hover:underline font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
