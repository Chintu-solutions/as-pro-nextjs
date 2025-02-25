"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Mail,
  Lock,
  Zap,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgetPass from "@/components/publisher/modals/ForgotPass";
import { authApi } from "@/lib/api/publisher/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface APIErrorData {
  success: boolean;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're already on the dashboard
        if (window.location.pathname.includes("/dashboard")) {
          setIsPageLoading(false);
          return;
        }

        setIsPageLoading(true);
        const token = localStorage.getItem("publisherToken");
        console.log("Token from localStorage:", token);

        // If no token exists, just return
        if (!token) {
          setIsPageLoading(false);
          return;
        }

        // Set token in cookie for middleware
        document.cookie = `publisherToken=${token}; path=/`;
        console.log("Cookie set:", document.cookie);

        try {
          // Verify if token is valid with API
          const isValid = await authApi.isAuthenticated();

          if (isValid) {
            // Redirect to dashboard
            toast.success("Already logged in! Redirecting to dashboard...");
            window.location.href = "/dashboard";
          } else {
            // Token is invalid, handle logout
            localStorage.removeItem("publisherToken");
            document.cookie =
              "publisherToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            await authApi.logout();
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          // Handle authentication errors
          localStorage.removeItem("publisherToken");
          document.cookie =
            "publisherToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      } finally {
        setIsPageLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", response);

      if (response.success) {
        // Store the token
        if (response.token) {
          // Save to localStorage
          localStorage.setItem("publisherToken", response.token);
          console.log("Token stored in localStorage:", response.token);

          // Set cookie for middleware
          document.cookie = `publisherToken=${response.token}; path=/`;
          console.log("Cookie set:", document.cookie);
        }

        // Show success message
        toast.success(response.message || "Welcome back!");

        // Add a small delay to ensure cookie is set before navigation
        setTimeout(() => {
          // Force a hard navigation instead of client-side navigation
          window.location.href = "/dashboard";
        }, 300);
      } else {
        // Handle unsuccessful login with valid response
        setErrors({ general: response.message || "Login failed" });
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const axiosError = error as AxiosError<APIErrorData>;

      // Extract error message directly from response when available
      const errorMessage =
        axiosError.response?.data?.message || "Login failed. Please try again.";

      if (axiosError.response?.status === 404) {
        setErrors({ general: "Publisher not found" });
        toast.error(errorMessage || "Publisher not found");
      } else if (axiosError.response?.status === 403) {
        if (errorMessage.includes("verify")) {
          setIsVerificationOpen(true);
          setErrors({ general: "Please verify your email to continue" });
          toast.warning(errorMessage || "Please verify your email to continue");
          return;
        } else {
          setErrors({
            general: errorMessage || "Account is temporarily unavailable",
          });
          toast.error(errorMessage || "Account is temporarily unavailable");
        }
      } else if (axiosError?.response?.status === 400) {
        setErrors({ general: errorMessage || "Invalid password" });
        toast.error(errorMessage || "Invalid password");
      } else {
        setErrors({
          general: errorMessage || "Login failed. Please try again.",
        });
        toast.error(errorMessage || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Loading state
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Side - Hero Section */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('/img/admin-login.png')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-10" />

        {/* Logo Section */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Zap className="mr-2 h-6 w-6 animate-pulse" />
          <span className="text-2xl font-bold">AdsPro</span>
        </div>

        {/* Testimonial Section */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-6">
            <p className="text-lg">
              &quot;This platform has completely transformed how we monetize our
              traffic. The analytics are incredible, and the payouts are always
              on time.&quot;
            </p>
            <footer className="flex items-center space-x-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10 backdrop-blur">
                <Image
                  src="/img/img.webp"
                  alt="Avatar"
                  className="object-cover"
                  fill
                  priority
                />
              </div>
              <div>
                <div className="text-base font-medium">Sofia Davis</div>
                <div className="text-sm text-white/60">Digital Publisher</div>
              </div>
            </footer>
          </blockquote>

          {/* Stats Section */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">$2.5M+</div>
              <div className="text-sm text-white/60">Paid to Publishers</div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">15K+</div>
              <div className="text-sm text-white/60">Active Publishers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 transition-all duration-200 hover:border-primary focus:border-primary ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 transition-all duration-200 hover:border-primary focus:border-primary ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div className="text-red-500 text-sm p-2 bg-red-50 rounded flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.general}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="grid gap-2 text-center text-sm">
                  <ForgetPass />
                  <div className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
