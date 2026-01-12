"use client"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { DealerPermission } from "@/lib/rbac"
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Calendar,
  Users,
  HandshakeIcon,
  Star,
  BarChart3,
  Settings,
  UsersRound,
} from "lucide-react"

interface SidebarProps {
  dealershipId: string;
  dealershipName: string;
  logoUrl: string | null;
  roleLabel: string;
  permissions: DealerPermission[];
}

interface NavRoute {
  label: string;
  icon: React.ElementType;
  href: string;
  permission?: DealerPermission;
}

export function Sidebar({ dealershipId, dealershipName, logoUrl, roleLabel, permissions }: SidebarProps) {
  const pathname = usePathname()
  const safePermissions = permissions ?? []

  // Define all routes with tenant-aware paths and permission requirements
  const routes: NavRoute[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/dealer/${dealershipId}`,
    },
    {
      label: "Inventory",
      icon: Car,
      href: `/dealer/${dealershipId}/inventory`,
    },
    {
      label: "Messaging",
      icon: MessageSquare,
      href: `/dealer/${dealershipId}/messaging`,
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: `/dealer/${dealershipId}/calendar`,
    },
    {
      label: "Leads",
      icon: Users,
      href: `/dealer/${dealershipId}/leads`,
    },
    {
      label: "Deals",
      icon: HandshakeIcon,
      href: `/dealer/${dealershipId}/deals`,
    },
    {
      label: "Reputation",
      icon: Star,
      href: `/dealer/${dealershipId}/reputation`,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: `/dealer/${dealershipId}/analytics`,
      permission: 'analytics:view',
    },
    {
      label: "Team",
      icon: UsersRound,
      href: `/dealer/${dealershipId}/team`,
      permission: 'team:view',
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/dealer/${dealershipId}/settings`,
      permission: 'dealership:edit',
    },
  ]

  // Filter routes based on permissions
  const visibleRoutes = routes.filter(route => {
    if (!route.permission) return true
    return safePermissions.includes(route.permission)
  })

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-60 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
        {logoUrl ? (
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image
              src={logoUrl}
              alt={dealershipName}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
        )}
        <span className="text-lg font-bold tracking-tight truncate">{dealershipName}</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-2">
          {visibleRoutes.map((route) => {
            const isActive = pathname === route.href || pathname?.startsWith(route.href + '/')
            const Icon = route.icon
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-light transition-all rounded-md group relative",
                  isActive
                    ? "bg-secondary/60 text-foreground font-bold border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <span>{route.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 flex items-center justify-between">
        <Badge variant="secondary" className="text-xs font-light">
          {roleLabel}
        </Badge>
        <ThemeToggle />
      </div>
    </aside>
  )
}
