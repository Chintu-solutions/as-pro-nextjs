"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authApi as adminAuthApi } from "@/lib/api/admin/auth";
import { authApi as publisherAuthApi } from "@/lib/api/publisher/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Current auth path:", pathname);

        // Determine which area we're in based on the path
        const isAdminAuth = pathname.includes("/admin/");
        const isPublisherAuth = !isAdminAuth && pathname.includes("/(auth)/");

        // Skip token verification for forget password pages
        if (pathname.includes("/forget")) {
          setIsLoading(false);
          return;
        }

        if (isAdminAuth && pathname.includes("/login")) {
          // Handle admin authentication for login page
          const adminToken = localStorage.getItem("adminToken");

          if (adminToken) {
            try {
              // Verify token validity
              const isValid = await adminAuthApi.isAuthenticated();
              if (isValid) {
                console.log(
                  "Admin already authenticated, redirecting to dashboard"
                );
                router.replace("/admin/dashboard");
                return;
              } else {
                // Invalid token, clear it
                localStorage.removeItem("adminToken");
              }
            } catch (error) {
              console.error("Admin token verification failed:", error);
              localStorage.removeItem("adminToken");
            }
          }
        } else if (
          isPublisherAuth &&
          (pathname.includes("/login") || pathname.includes("/signup"))
        ) {
          // Handle publisher authentication for login/signup pages
          const publisherToken = localStorage.getItem("publisherToken");

          if (publisherToken) {
            try {
              // Verify token validity
              const isValid = await publisherAuthApi.isAuthenticated();
              if (isValid) {
                console.log(
                  "Publisher already authenticated, redirecting to dashboard"
                );
                router.replace("/dashboard");
                return;
              } else {
                // Invalid token, clear it
                localStorage.removeItem("publisherToken");
              }
            } catch (error) {
              console.error("Publisher token verification failed:", error);
              localStorage.removeItem("publisherToken");
            }
          }
        }
      } catch (error) {
        console.error("Auth layout error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      {children}
    </div>
  );
}
