import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  PlusCircleIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline"
import { useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import * as authApi from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
    ].join(" ")

  return (
    <>
      <NavLink to="/prs" end className={linkClass} onClick={onNavigate}>
        <TableCellsIcon className="size-4 shrink-0" />
        PR list
      </NavLink>
      <NavLink to="/prs/new" className={linkClass} onClick={onNavigate}>
        <PlusCircleIcon className="size-4 shrink-0" />
        Add PR
      </NavLink>
    </>
  )
}

export function AppShell() {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    try {
      await authApi.logout()
    } catch {
      /* still clear client session */
    }
    setToken(null)
    toast.success("Signed out")
    setMobileOpen(false)
    navigate("/login", { replace: true })
  }

  return (
    <div className="ambient-bg min-h-svh">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col md:flex-row">
        <aside className="glass-panel text-sidebar-foreground border-sidebar-border sticky top-6 z-30 mt-6 mb-6 hidden h-fit max-h-[calc(100svh-3rem)] w-56 shrink-0 flex-col overflow-y-auto border bg-sidebar/90 p-4 backdrop-blur-xl md:flex">
          <div className="mb-5 px-1">
            <Link to="/prs" className="font-semibold tracking-tight text-foreground">
              Gym PR Tracker
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">Personal records</p>
          </div>
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
          <Button
            type="button"
            variant="outline"
            className="mt-5 justify-start gap-2 rounded-full border-white/15"
            onClick={() => void handleLogout()}
          >
            <ArrowRightOnRectangleIcon className="size-4" />
            Log out
          </Button>
        </aside>

        <header className="glass-panel sticky top-0 z-40 flex items-center justify-between gap-3 border-b bg-sidebar/80 p-3 backdrop-blur-xl md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-full border-white/15"
            onClick={() => setMobileOpen(true)}
          >
            <Bars3Icon className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Link to="/prs" className="font-semibold text-foreground">
            Gym PR
          </Link>
          <ThemeToggle />
        </header>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="flex w-[min(100vw-3rem,18rem)] flex-col gap-6 border-white/10 bg-sidebar/95 p-4 backdrop-blur-xl">
            <div>
              <p className="font-semibold text-foreground">Gym PR Tracker</p>
              <p className="text-xs text-muted-foreground">Personal records</p>
            </div>
            <nav className="flex flex-col gap-1">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </nav>
            <Button
              type="button"
              variant="outline"
              className="mt-auto justify-start gap-2 rounded-full"
              onClick={() => void handleLogout()}
            >
              <ArrowRightOnRectangleIcon className="size-4" />
              Log out
            </Button>
          </SheetContent>
        </Sheet>

        <div className="flex min-h-svh flex-1 flex-col">
          <div className="hidden items-center justify-end gap-2 border-b border-transparent px-6 py-3 md:flex">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full text-muted-foreground"
                )}
              >
                Account
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => void handleLogout()}>
                  <ArrowRightOnRectangleIcon className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
