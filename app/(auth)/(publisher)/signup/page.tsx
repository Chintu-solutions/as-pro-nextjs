"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Mail, User, Lock, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api/publisher/auth";
import { toast } from "sonner";
import VerificationPopup from "@/components/publisher/modals/VerificationPopup";
import type { AxiosError } from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface APIErrorData {
  success: boolean;
  message: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        setUserEmail(formData.email);
        setIsVerificationOpen(true);
        toast.success(
          response.message || "Please check your email for verification code"
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorData>;

      // Handle email verification case first
      if (
        axiosError.response?.data?.message?.includes("verify") ||
        axiosError.response?.data?.message?.includes("Verify")
      ) {
        setUserEmail(formData.email);
        setIsVerificationOpen(true);
        toast.warning("Please verify your email to continue");
        return;
      }

      // Handle other error cases
      if (axiosError.response?.status === 400) {
        if (axiosError.response.data?.message?.includes("Email")) {
          toast.error("Email already registered");
        } else {
          toast.error(
            axiosError.response.data?.message || "Registration failed"
          );
        }
      } else {
        toast.error(
          axiosError.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
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
          <span className="text-2xl font-bold">TrafficPro</span>
        </div>

        {/* Testimonial Section */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-6">
            <p className="text-lg">
              &quot;TrafficPro revolutionized our approach to traffic
              management. The analytics are precise, and the support team is
              exceptional. It&apos;s more than a tool; it&apos;s a game-changer
              for publishers.&quot;
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
                <div className="text-base font-medium">Michael Chen</div>
                <div className="text-sm text-white/60">Digital Publisher</div>
              </div>
            </footer>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-lg bg-white/10 p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="text-2xl font-bold">$2.5M+</div>
                <div className="text-sm text-white/60">Paid to Publishers</div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white/10 p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="text-2xl font-bold">15K+</div>
                <div className="text-sm text-white/60">Active Publishers</div>
              </div>
            </div>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <CardDescription>
                Enter your details to get started with TrafficPro
              </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
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
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10"
                      disabled={isLoading}
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="text-sm text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <VerificationPopup
        isOpen={isVerificationOpen}
        setIsOpen={(open) => {
          setIsVerificationOpen(open);
          if (!open) {
            setUserEmail("");
          }
        }}
        email={userEmail}
        onSuccess={() => {
          const credentials = {
            email: userEmail,
            password: formData.password,
          };
          authApi
            .login(credentials)
            .then(() => {
              router.push("/dashboard");
              toast.success("Login successful!");
            })
            .catch(() => {
              router.push("/login");
              toast.error("Please try logging in again");
            });
        }}
      />
    </div>
  );
}
