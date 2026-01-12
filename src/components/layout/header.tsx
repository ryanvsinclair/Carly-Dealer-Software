"use client"

import { useState } from "react"
import { Menu, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavList } from "@/components/nav/nav-item"

export function Header() {
  const [open, setOpen] = useState(false)

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
              <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold tracking-tight">Carly Dealer</span>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-6" onClick={() => setOpen(false)}>
                <NavList />
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4">
                <div className="text-xs text-muted-foreground font-light">
                  Precision Management
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">Carly Dealer</span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
