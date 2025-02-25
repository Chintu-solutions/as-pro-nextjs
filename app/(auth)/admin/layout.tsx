"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api/admin/auth";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Immediately check for token to prevent even momentary display of protected content
    const adminToken = localStorage.getItem("adminToken");
    const isAuthPage =
      pathname === "/admin/login" || pathname.includes("/admin/forget");
    console.log("isAuthPage", isAuthPage);
    // If we're not on an auth page and there's no token, redirect immediately
    if (!isAuthPage && !adminToken) {
      console.log("No admin token, redirecting to login");
      router.replace("/admin/login");
      return;
    }

    const checkAdminAuth = async () => {
      try {
        // Skip authentication check for login and forget password
        if (isAuthPage) {
          setIsLoading(false);
          return;
        }

        if (!adminToken) {
          // This is a redundant check since we already checked above, but keeping for robustness
          console.log("No admin token found, redirecting to login");
          toast.error("Please login to access the admin dashboard");
          router.replace("/admin/login");
          return;
        }

        try {
          // Verify if token is valid with API
          const isValid = await authApi.isAuthenticated();

          if (!isValid) {
            // Invalid token, handle logout
            console.log("Admin token invalid, redirecting to login");
            localStorage.removeItem("adminToken");
            toast.error("Session expired. Please login again.");
            router.replace("/admin/login");
            return;
          }

          // If we reach here, authentication is successful
          setIsLoading(false);
        } catch (error) {
          console.error("Admin auth verification error:", error);
          // Handle authentication errors
          localStorage.removeItem("adminToken");
          toast.error("Authentication error. Please login again.");
          router.replace("/admin/login");
        }
      } catch (error) {
        console.error("General error in auth check:", error);
        router.replace("/admin/login");
      }
    };

    checkAdminAuth();

    // This is important: If the user navigates away during auth check, we should stop execution
    return () => {
      // Cleanup function
      setIsLoading(false);
    };
  }, [pathname, router]);

  // Only show content after authentication is complete
  // This prevents any momentary flash of protected content
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Check again for token - this ensures we never render protected content without a token
  const adminToken = localStorage.getItem("adminToken");
  const isAuthPage =
    pathname === "/admin/login" || pathname.includes("/admin/forget");

  // For auth pages (login/forget), just render children
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // For protected pages, only render if token exists
  if (!adminToken) {
    // If somehow we got here without a token, show nothing
    // The useEffect will handle redirection
    return null;
  }

  // Only render dashboard layout if we have a token
  return (
    <div className="flex min-h-screen flex-col">
      {/* Your admin dashboard layout here */}
      <header>{/* Admin header */}</header>
      <div className="flex flex-1">
        <nav className="w-64">{/* Admin sidebar */}</nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
