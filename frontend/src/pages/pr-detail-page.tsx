import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api/client"
import { deletePr, getPr, updatePr } from "@/lib/api/pr"
import { cn } from "@/lib/utils"
import {
  createPrSchema,
  type CreatePrFormValues,
  type CreatePrValues,
} from "@/schemas/pr"

export function PrDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const prId = Number(id)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const query = useQuery({
    queryKey: ["prs", prId],
    queryFn: () => getPr(prId),
    enabled: Number.isFinite(prId),
  })

  const form = useForm<CreatePrFormValues>({
    resolver: zodResolver(createPrSchema),
    defaultValues: {
      exercise_title: "",
      remarks: "",
    },
    mode: "onTouched",
  })

  useEffect(() => {
    if (!query.data) return
    form.reset({
      exercise_title: query.data.exercise_title,
      remarks: query.data.remarks ?? "",
      weight: query.data.weight,
      reps: query.data.reps,
    })
  }, [query.data, form])

  const updateMutation = useMutation({
    mutationFn: (values: CreatePrValues) =>
      updatePr(prId, {
        exercise_title: values.exercise_title.trim(),
        remarks: values.remarks?.trim() || undefined,
        weight: values.weight,
        reps: values.reps,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["prs"] })
      void queryClient.invalidateQueries({ queryKey: ["prs", prId] })
      toast.success("PR updated")
      navigate("/prs", { replace: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : "Could not update"
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deletePr(prId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["prs"] })
      toast.success("PR deleted")
      setDeleteOpen(false)
      navigate("/prs", { replace: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : "Could not delete"
      toast.error(msg)
    },
  })

  if (!Number.isFinite(prId)) {
    return (
      <div className="glass-panel max-w-xl p-6 text-sm text-destructive">
        Invalid record id.
      </div>
    )
  }

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="glass-panel space-y-4 p-8">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    const msg = query.error instanceof ApiError ? query.error.message : "Could not load PR"
    return (
      <div className="glass-panel max-w-xl p-6 text-sm text-destructive">
        {msg}
        <div className="mt-4">
          <Link
            to="/prs"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-full")}
          >
            Back to list
          </Link>
        </div>
      </div>
    )
  }

  const record = query.data

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        to="/prs"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 inline-flex gap-2 rounded-full text-muted-foreground"
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Back to list
      </Link>

      <div className="glass-panel p-6 md:p-8">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="flex flex-col gap-2 px-0 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Edit PR</CardTitle>
              <CardDescription>
                Last updated{" "}
                {new Date(record.updated_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {record.PR != null ? (
                  <>
                    {" "}
                    · Computed PR score: <span className="font-medium text-primary">{record.PR}</span>
                  </>
                ) : null}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="mt-2 shrink-0 rounded-full sm:mt-0"
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((vals) => updateMutation.mutate(vals as CreatePrValues))}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="edit-exercise_title">Exercise</Label>
                <Input
                  id="edit-exercise_title"
                  className="rounded-xl border-white/15 bg-background/40"
                  {...form.register("exercise_title")}
                  aria-invalid={Boolean(form.formState.errors.exercise_title)}
                />
                {form.formState.errors.exercise_title ? (
                  <p className="text-xs text-destructive">{form.formState.errors.exercise_title.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Weight (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    step="any"
                    className="rounded-xl border-white/15 bg-background/40"
                    {...form.register("weight")}
                    aria-invalid={Boolean(form.formState.errors.weight)}
                  />
                  {form.formState.errors.weight ? (
                    <p className="text-xs text-destructive">{form.formState.errors.weight.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-reps">Reps</Label>
                  <Input
                    id="edit-reps"
                    type="number"
                    className="rounded-xl border-white/15 bg-background/40"
                    {...form.register("reps")}
                    aria-invalid={Boolean(form.formState.errors.reps)}
                  />
                  {form.formState.errors.reps ? (
                    <p className="text-xs text-destructive">{form.formState.errors.reps.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-remarks">Notes (optional)</Label>
                <Input
                  id="edit-remarks"
                  className="rounded-xl border-white/15 bg-background/40"
                  {...form.register("remarks")}
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Link
                  to="/prs"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "rounded-full border-white/15"
                  )}
                >
                  Cancel
                </Link>
                <Button type="submit" className="rounded-full" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this PR?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes “{record.exercise_title}” from your log. You cannot undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="rounded-full"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
