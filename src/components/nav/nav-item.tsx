"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Inventory",
    icon: Car,
    href: "/inventory",
  },
  {
    label: "Messaging",
    icon: MessageSquare,
    href: "/messaging",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Leads",
    icon: Users,
    href: "/leads",
  },
  {
    label: "Deals",
    icon: HandshakeIcon,
    href: "/deals",
  },
  {
    label: "Reputation",
    icon: Star,
    href: "/reputation",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

interface NavItemProps {
  label: string
  icon: React.ElementType
  href: string
}

export function NavItem({ label, icon: Icon, href }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm font-light transition-all rounded-md group relative",
        isActive
          ? "bg-secondary/60 text-foreground font-bold border-l-2 border-primary"
          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
      <span>{label}</span>
    </Link>
  )
}

export function NavList() {
  return (
    <nav className="space-y-1 px-2">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
        />
      ))}
    </nav>
  )
}
