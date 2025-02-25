"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgetPass from "@/components/admin/modals/ForgotPass";
import { authApi } from "@/lib/api/admin/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// types for admin login
interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface FormData {
  email: string;
  password: string;
}

class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AuthError";
  }
}

interface StatsCardProps {
  title: string;
  value: string;
  gradient: string;
}

// Stats Card Component
const StatsCard = ({ title, value, gradient }: StatsCardProps) => (
  <div className="glass-card p-4 rounded-lg">
    <div
      className={`text-2xl font-bold ${gradient} bg-clip-text text-transparent`}
    >
      {value}
    </div>
    <div
      className={`text-sm opacity-80 ${gradient} bg-clip-text text-transparent`}
    >
      {title}
    </div>
  </div>
);

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're already on the dashboard page to prevent loops
        if (window.location.pathname.includes("/admin/dashboard")) {
          setIsPageLoading(false);
          return;
        }

        setIsPageLoading(true);
        const token = localStorage.getItem("adminToken");
        console.log("Token from localStorage:", token);

        // If no token exists on login page, just return
        if (!token) {
          setIsPageLoading(false);
          return;
        }

        // Set token in cookie with proper attributes - IMPORTANT for middleware
        document.cookie = `adminToken=${token}; path=/`;
        console.log("Cookie set:", document.cookie);

        try {
          // Verify if token is valid with API
          const isValid = await authApi.isAuthenticated();

          if (isValid) {
            // Show success message
            toast.success("Already authenticated! Redirecting to dashboard...");

            // Use window.location for a full page navigation to ensure middleware gets the cookie
            window.location.href = "/admin/dashboard";
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          handleLogout();
        }
      } finally {
        setIsPageLoading(false);
      }
    };

    // Helper function to handle logout logic
    const handleLogout = async () => {
      localStorage.removeItem("adminToken");
      document.cookie =
        "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      try {
        await authApi.logout();
      } catch (logoutError) {
        console.error("Logout error:", logoutError);
      }
    };

    checkAuth();
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login response:", response);

      if (response && response.token) {
        // Store token in localStorage
        localStorage.setItem("adminToken", response.token);
        console.log("Token stored in localStorage:", response.token);

        // Set cookie for middleware - IMPORTANT for middleware
        document.cookie = `adminToken=${response.token}; path=/`;
        console.log("Cookie set:", document.cookie);

        // Show success message
        toast.success(response.message || "Login successful!", {
          duration: 2000,
          position: "top-center",
        });

        // Add a small delay to ensure cookie is set before navigation
        setTimeout(() => {
          // Use window.location for a full page navigation to ensure middleware gets the cookie
          window.location.href = "/admin/dashboard";
        }, 300);
      } else {
        console.error("No token received in response:", response);
        setErrors({
          general:
            response.message || "Authentication failed. No token received.",
        });
        toast.error(response.message || "Login failed - no token received");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Extract error message from the API response if available
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as any).data?.message ||
        (error as any).message ||
        "An unexpected error occurred";

      if (error instanceof AuthError) {
        handleAuthError(error);
      } else {
        setErrors({
          general: errorMessage,
        });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle authentication errors
  const handleAuthError = (error: AuthError) => {
    switch (error.statusCode) {
      case 401:
        setErrors({ general: "Invalid email or password" });
        toast.error("Invalid credentials");
        break;
      case 403:
        setErrors({ general: "Account is locked. Please contact support." });
        toast.error("Account locked");
        break;
      default:
        setErrors({
          general:
            error.message || "An error occurred. Please try again later.",
        });
        toast.error(error.message || "Login failed");
    }
  };

  // Loading state
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Main render
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Hero Section */}
      <section className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900" />
        <div className="absolute inset-0 bg-[url('/img/admin-login.png')] bg-no-repeat bg-cover bg-center mix-blend-overlay opacity-50" />

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
                  height={300}
                  width={300}
                  src="/img/img.webp"
                  alt="Admin"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">System Administrator</div>
                <div className="text-sm opacity-80">TrafficPro Team</div>
              </div>
            </footer>
          </blockquote>

          {/* Stats */}
          <div className="flex gap-4">
            <StatsCard
              title="Platform Uptime"
              value="100%"
              gradient="bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <StatsCard
              title="System Monitoring"
              value="24/7"
              gradient="bg-gradient-to-r from-green-500 to-teal-500"
            />
          </div>
        </div>
      </section>

      {/* Right Panel - Login Form */}
      <section className="lg:p-8 animate-fade-in">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gradient">
                Admin Access
              </CardTitle>
              <CardDescription>
                Enter your admin credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="admin@trafficpro.com"
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
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="********"
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
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password}
                      </div>
                    )}
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
                  className="w-full hover-button bg-gradient-to-r from-slate-900 to-indigo-900"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                  <ForgetPass />
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
