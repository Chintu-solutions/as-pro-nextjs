"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  DollarSign,
  BarChart,
  Users,
  Settings,
  Shield,
  FileText,
  HelpCircle,
  Bell,
  Wallet,
  MessageSquare,
  PieChart,
  LineChart,
  BookOpen,
  LogOut,
} from "lucide-react";
import { authApi } from "@/lib/api/admin/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      authApi.logout();
      toast.success("Logged out successfully");
      router.push(isAdmin ? "/admin/login" : "/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const adminLinks = [
    {
      group: "Overview",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart },
      ],
    },
    {
      group: "Management",
      items: [
        { href: "/admin/publishers", label: "Publishers", icon: Users },
        { href: "/admin/websites", label: "Websites", icon: Globe },
        { href: "/admin/payments", label: "Payments", icon: DollarSign },
      ],
    },
    {
      group: "Reports",
      items: [
        { href: "/admin/reports/revenue", label: "Revenue", icon: LineChart },
        { href: "/admin/reports/traffic", label: "Traffic", icon: PieChart },
      ],
    },
    {
      group: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/admin/support", label: "Support", icon: MessageSquare },
        {
          href: "/admin/documentation",
          label: "Documentation",
          icon: BookOpen,
        },
      ],
    },
  ];

  const publisherLinks = [
    {
      group: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/analytics", label: "Analytics", icon: BarChart },
      ],
    },
    {
      group: "Management",
      items: [
        { href: "/websites", label: "My Websites", icon: Globe },
        { href: "/earnings", label: "Earnings", icon: DollarSign },
        { href: "/wallet", label: "Wallet", icon: Wallet },
      ],
    },
    {
      group: "Reports",
      items: [
        { href: "/reports/performance", label: "Performance", icon: LineChart },
        { href: "/reports/traffic", label: "Traffic", icon: PieChart },
        { href: "/reports/payments", label: "Payments", icon: FileText },
      ],
    },
    {
      group: "Account",
      items: [
        { href: "/settings", label: "Settings", icon: Settings },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/support", label: "Support", icon: HelpCircle },
      ],
    },
  ];

  const links = isAdmin ? adminLinks : publisherLinks;

  return (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex-1 border-r",
          isAdmin ? "bg-white dark:bg-slate-950" : "bg-white dark:bg-pink-950"
        )}
      >
        <div className="p-6">
          <div
            className={cn(
              "flex items-center gap-2 mb-8",
              isAdmin
                ? "text-slate-900 dark:text-white"
                : "text-pink-900 dark:text-pink-100"
            )}
          >
            {isAdmin ? (
              <Shield className="h-6 w-6" />
            ) : (
              <Globe className="h-6 w-6" />
            )}
            <span
              className={cn(
                "font-bold text-lg",
                isAdmin
                  ? "bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent dark:from-slate-100 dark:to-indigo-100"
                  : "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-pink-300 dark:to-purple-300"
              )}
            >
              {isAdmin ? "Admin Portal" : "Publisher Portal"}
            </span>
          </div>
          <nav className="space-y-6">
            {links.map((group) => (
              <div key={group.group}>
                <h3
                  className={cn(
                    "text-xs font-semibold mb-2 px-3",
                    isAdmin
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-pink-600 dark:text-pink-400"
                  )}
                >
                  {group.group}
                </h3>
                <div className="space-y-1">
                  {group.items.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? isAdmin
                              ? "bg-gradient-to-r from-slate-900 to-indigo-900 text-white dark:from-slate-800 dark:to-indigo-800"
                              : "bg-gradient-to-r from-pink-600 to-purple-600 text-white dark:from-pink-800 dark:to-purple-800"
                            : isAdmin
                            ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            : "text-pink-700 hover:bg-pink-100 dark:text-pink-300 dark:hover:bg-pink-900"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div
        className={cn(
          "p-4 border-t",
          isAdmin
            ? "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            : "bg-white dark:bg-pink-950 border-pink-100 dark:border-pink-900"
        )}
      >
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            isAdmin
              ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              : "text-pink-700 hover:bg-pink-100 dark:text-pink-300 dark:hover:bg-pink-900"
          )}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
