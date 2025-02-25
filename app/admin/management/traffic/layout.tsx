import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";

export default function TrafficManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
