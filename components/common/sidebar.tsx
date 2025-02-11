"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  // Admin routes remain unchanged since they should be prefixed
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

  // Modified publisher routes without the /publisher prefix
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
    <div className="flex flex-col h-full border-r bg-card">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          {isAdmin ? (
            <Shield className="h-6 w-6" />
          ) : (
            <Globe className="h-6 w-6" />
          )}
          <span className="font-bold text-lg">
            {isAdmin ? "Admin Portal" : "Publisher Portal"}
          </span>
        </div>
        <nav className="space-y-6">
          {links.map((group) => (
            <div key={group.group}>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        pathname === link.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
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
  );
}
