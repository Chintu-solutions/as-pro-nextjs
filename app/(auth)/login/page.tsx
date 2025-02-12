"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Mail, Lock, Zap } from "lucide-react";
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

interface APIErrorData {
  success: boolean;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        router.push("/dashboard");
        toast.success(response.message || "Welcome back!");
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorData>;

      if (axiosError.response?.status === 404) {
        toast.error("Publisher not found");
      } else if (axiosError.response?.status === 403) {
        if (axiosError.response.data?.message?.includes("verify")) {
          setIsVerificationOpen(true);
          toast.warning("Please verify your email to continue");
          return;
        } else {
          toast.error(
            axiosError.response.data?.message ||
              "Account is temporarily unavailable"
          );
        }
      } else if (axiosError?.response?.status === 400) {
        toast.error(axiosError?.response.data?.message || "Invalid password");
      } else {
        toast.error(
          axiosError?.response?.data?.message ??
            "Login failed. Please try again."
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
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
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
                    <div className="text-sm text-center text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/signup"
                        className="text-primary hover:underline"
                      >
                        Sign up
                      </Link>
                    </div>
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
