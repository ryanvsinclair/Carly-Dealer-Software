"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Profile", href: "/settings/profile" },
  { name: "Dealership", href: "/settings/dealership" },
  { name: "Team", href: "/settings/team" },
  { name: "Integrations", href: "/settings/integrations" },
];

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { dealershipId: string };
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 lg:p-12 space-y-8">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Manage your account, dealership, team, and integrations
        </p>
      </div>

      <div className="border-b border-border">
        <nav className="flex space-x-8" aria-label="Settings tabs">
          {tabs.map((tab) => {
            const href = `/${params.dealershipId}${tab.href}`;
            const isActive = pathname === href;
            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "border-b-2 px-1 py-4 text-sm font-bold transition-colors",
                  isActive
                    ? "border-blue-500 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  );
}
