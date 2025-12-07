"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, Clock, TrendingUp, BarChart3, UserRoundX } from "lucide-react";

const navItems = [
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Clock,
  },
  {
    title: "Performance",
    href: "/performance",
    icon: TrendingUp,
  },
  {
    title: "Leave Requests",
    href: "/leaveRequests",
    icon: UserRoundX,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex h-10 items-center">
          <Image
            src="/brand/logo_color.svg"
            alt="Effeciency"
            width={120}
            height={28}
            className="dark:hidden h-7 w-auto"
            priority
          />
          <Image
            src="/brand/logo_white.svg"
            alt="Effeciency"
            width={120}
            height={28}
            className="hidden dark:block h-7 w-auto"
            priority
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
