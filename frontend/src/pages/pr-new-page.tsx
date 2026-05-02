import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api/client"
import { createPr } from "@/lib/api/pr"
import { cn } from "@/lib/utils"
import {
  createPrSchema,
  type CreatePrFormValues,
  type CreatePrValues,
} from "@/schemas/pr"

export function PrNewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<CreatePrFormValues>({
    resolver: zodResolver(createPrSchema),
    defaultValues: {
      exercise_title: "",
      remarks: "",
    },
    mode: "onTouched",
  })

  const mutation = useMutation({
    mutationFn: (values: CreatePrValues) =>
      createPr({
        exercise_title: values.exercise_title.trim(),
        remarks: values.remarks?.trim() || undefined,
        weight: values.weight,
        reps: values.reps,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["prs"] })
      toast.success("PR saved")
      navigate("/prs", { replace: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : "Could not save PR"
      toast.error(msg)
    },
  })

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
          <CardHeader className="px-0 pb-6">
            <CardTitle className="text-xl font-semibold">New personal record</CardTitle>
            <CardDescription>
              Exercise titles must be unique for your account. Weight and reps drive your PR score on the server.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((vals) => mutation.mutate(vals as CreatePrValues))}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="exercise_title">Exercise</Label>
                <Input
                  id="exercise_title"
                  placeholder="e.g. Back squat"
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
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="any"
                    inputMode="decimal"
                    className="rounded-xl border-white/15 bg-background/40"
                    {...form.register("weight")}
                    aria-invalid={Boolean(form.formState.errors.weight)}
                  />
                  {form.formState.errors.weight ? (
                    <p className="text-xs text-destructive">{form.formState.errors.weight.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    inputMode="numeric"
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
                <Label htmlFor="remarks">Notes (optional)</Label>
                <Input
                  id="remarks"
                  placeholder="Tempo, stance, how it felt…"
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
                <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving…" : "Save PR"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
