"use client";

import { Sidebar } from "@/components/common/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/common/header";
import { authApi as adminAuthApi } from "@/lib/api/admin/auth";
import { authApi as publisherAuthApi } from "@/lib/api/publisher/auth";

export default function PublisherLayout({
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
        const token = localStorage.getItem("publisherToken");
        console.log("Current auth path:1", pathname);
        if (!token) {
          router.replace("/login");
          return;
        }

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
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-none">
        <Sidebar isAdmin={false} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header
          user={{
            name: "Publisher User",
            email: "publisher@example.com",
          }}
        />
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
