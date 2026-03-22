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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

export function MobileNav() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-64 bg-[#0D1117] text-[#F5F2EB] border-[#0D1117]/20">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[#F5F2EB]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A84C]/10">
              <span className="text-lg font-bold text-[#C9A84C]">C</span>
            </div>
            <span className="text-lg font-semibold">
              Comm<span className="text-[#C9A84C]">Platform</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-[#F5F2EB]/5",
                  isActive && [
                    "bg-[#F5F2EB]/10 border-l-2 border-[#C9A84C]",
                    "text-[#F5F2EB]",
                  ],
                  !isActive && "text-[#F5F2EB]/70"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-[#C9A84C]")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
