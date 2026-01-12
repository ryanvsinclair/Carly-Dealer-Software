"use client"

import { NavList } from "@/components/nav/nav-item"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Car } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-60 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
        <Car className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight">Carly Dealer</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <NavList />
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-light">
          Precision Management
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}
