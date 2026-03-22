"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  Megaphone,
  MessageSquare,
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui-store";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/pipelines", label: "Pipelines", icon: GitBranch },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/communications", label: "Communications", icon: MessageSquare },
  { href: "/automations", label: "Automations", icon: Zap },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen border-r transition-all duration-300",
        "bg-[#1E1B4B] text-[#E0E7FF] border-[#312E81]",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b border-[#312E81] px-4">
        {sidebarCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#818CF8]/10">
            <span className="text-lg font-bold text-[#818CF8]">F</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#818CF8]/10">
              <span className="text-lg font-bold text-[#818CF8]">F</span>
            </div>
            <span className="text-lg font-semibold">
              Flow<span className="text-[#818CF8]">CRM</span>
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                "hover:bg-[#E0E7FF]/5",
                isActive && [
                  "bg-[#E0E7FF]/10 border-l-2 border-[#818CF8]",
                  "text-[#E0E7FF]",
                ],
                !isActive && "text-[#E0E7FF]/70"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-[#818CF8]")} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
