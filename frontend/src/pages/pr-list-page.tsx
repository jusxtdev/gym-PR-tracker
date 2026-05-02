import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { listPrs } from "@/lib/api/pr"
import { ApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import type { PrRecord } from "@/types/pr"

function prSearchMatch(pr: PrRecord, q: string): boolean {
  if (!q.trim()) return true
  const s = q.trim().toLowerCase()
  const title = pr.exercise_title.toLowerCase()
  const remarks = (pr.remarks ?? "").toLowerCase()
  return title.includes(s) || remarks.includes(s)
}

function PrRow({ pr }: { pr: PrRecord }) {
  return (
    <Link
      to={`/prs/${pr.id}`}
      className={cn(
        "glass-row group block px-4 py-3",
        "hover:border-primary/35 hover:bg-white/[0.09] dark:hover:bg-zinc-900/70"
      )}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">{pr.exercise_title}</p>
          {pr.remarks ? (
            <p className="line-clamp-1 text-sm text-muted-foreground">{pr.remarks}</p>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-3 text-sm sm:mt-0">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{pr.weight}</span> kg
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{pr.reps}</span> reps
          </span>
          {pr.PR != null ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              PR: {pr.PR}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-row space-y-2 px-4 py-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-3 pt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PrListPage() {
  const [search, setSearch] = useState("")

  const query = useQuery({
    queryKey: ["prs"],
    queryFn: listPrs,
  })

  const filtered = useMemo(() => {
    if (!query.data) return []
    return query.data.filter((p) => prSearchMatch(p, search))
  }, [query.data, search])

  if (query.isError) {
    const msg = query.error instanceof ApiError ? query.error.message : "Could not load PRs"
    return (
      <div className="glass-panel max-w-xl p-6 text-sm text-destructive">
        {msg}
        {query.error instanceof ApiError && query.error.status === 401 ? (
          <p className="mt-2 text-muted-foreground">Try signing in again.</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your PRs</h1>
          <p className="text-sm text-muted-foreground">Search and open a record to edit or review.</p>
        </div>
        <Link
          to="/prs/new"
          className={cn(buttonVariants(), "w-full gap-1.5 rounded-full sm:w-auto")}
        >
          <PlusCircleIcon className="size-4" />
          Add PR
        </Link>
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by exercise or notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-full border-white/15 bg-background/40 pl-12"
          aria-label="Search personal records"
        />
      </div>

      {query.isLoading ? <ListSkeleton /> : null}

      {!query.isLoading && query.data?.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="max-w-sm text-muted-foreground">
            No personal records yet. Log your first lift to see it here.
          </p>
          <Link
            to="/prs/new"
            className={cn(buttonVariants(), "gap-1.5 rounded-full")}
          >
            <PlusCircleIcon className="size-4" />
            Add your first PR
          </Link>
        </div>
      ) : null}

      {!query.isLoading && query.data && query.data.length > 0 && filtered.length === 0 ? (
        <div className="glass-panel px-6 py-12 text-center text-sm text-muted-foreground">
          No matches for “{search.trim()}”. Try another search or{" "}
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => setSearch("")}
          >
            clear search
          </button>
          .
        </div>
      ) : null}

      {!query.isLoading && filtered.length > 0 ? (
        <ul className="space-y-3">
          {filtered.map((pr) => (
            <li key={pr.id}>
              <PrRow pr={pr} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
