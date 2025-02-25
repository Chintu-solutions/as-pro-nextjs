import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current URL path segments
  const segments = new URL(
    typeof window !== "undefined" ? window.location.href : "http://localhost"
  ).pathname.split("/");

  // Check if we're in the login page
  const isLoginPage = segments.includes("login");

  // If it's a login page, don't show the sidebar and header
  if (isLoginPage) {
    return children;
  }

  // Otherwise, show the admin layout with sidebar and header
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-none">
        <Sidebar isAdmin={true} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header
          user={{
            name: "Admin User",
            email: "admin@example.com",
          }}
        />
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
