import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api/client"
import * as authApi from "@/lib/api/auth"
import { useAuth } from "@/providers/auth-provider"
import { type SignInForm, signInSchema } from "@/schemas/auth"

export function LoginPage() {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? "/prs"

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: "", password: "" },
    mode: "onTouched",
  })

  const mutation = useMutation({
    mutationFn: (values: SignInForm) => authApi.signIn(values.username, values.password),
    onSuccess: (token) => {
      setToken(token)
      toast.success("Welcome back")
      navigate(from, { replace: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : "Could not sign in"
      toast.error(msg)
    },
  })

  return (
    <div className="ambient-bg relative flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4 flex gap-2">
        <ThemeToggle />
      </div>

      <div className="glass-panel w-full max-w-md p-8">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-1 px-0 pb-6 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to track your gym personal records.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((vals) => mutation.mutate(vals))}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  className="rounded-full border-white/15 bg-background/40"
                  {...form.register("username")}
                  aria-invalid={Boolean(form.formState.errors.username)}
                />
                {form.formState.errors.username ? (
                  <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="rounded-full border-white/15 bg-background/40"
                  {...form.register("password")}
                  aria-invalid={Boolean(form.formState.errors.password)}
                />
                {form.formState.errors.password ? (
                  <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="mt-2 w-full rounded-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Signing in…" : "Sign in"}
                <ArrowRightIcon className="size-4" data-icon="inline-end" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
