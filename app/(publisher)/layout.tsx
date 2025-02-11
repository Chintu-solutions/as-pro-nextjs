import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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