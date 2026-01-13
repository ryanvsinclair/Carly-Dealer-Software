"use client"

import { useState } from "react"
import { Menu, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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

interface HeaderProps {
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

export function Header({ dealershipId, dealershipName, logoUrl, roleLabel, permissions }: HeaderProps) {
  const [open, setOpen] = useState(false)
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
      permission: 'analytics.view',
    },
    {
      label: "Team",
      icon: UsersRound,
      href: `/dealer/${dealershipId}/team`,
      permission: 'team.view',
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/dealer/${dealershipId}/settings`,
      permission: 'dealership.edit',
    },
  ]

  // Filter routes based on permissions
  const visibleRoutes = routes.filter(route => {
    if (!route.permission) return true
    return safePermissions.includes(route.permission)
  })

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <div className="flex flex-col h-full">
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
              <div className="flex-1 overflow-y-auto py-6" onClick={() => setOpen(false)}>
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
              <div className="border-t border-border p-4">
                <Badge variant="secondary" className="text-xs font-light">
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-3">
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
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight leading-tight">{dealershipName}</span>
            <span className="text-xs text-muted-foreground font-light capitalize leading-tight">{roleLabel}</span>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
