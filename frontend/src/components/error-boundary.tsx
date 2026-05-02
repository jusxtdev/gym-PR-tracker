import { Component, type ErrorInfo, type ReactNode } from "react"
import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = { children: ReactNode }
type State = { hasError: boolean }

/**
 * Catches render errors in child components so a blank screen is less likely in production.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ambient-bg flex min-h-svh flex-col items-center justify-center px-6 py-12">
          <div className="glass-panel max-w-md space-y-4 p-8 text-center">
            <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              Refresh the page or go back to your PR list. If this keeps happening, check the browser console.
            </p>
            <Link to="/prs" className={cn(buttonVariants(), "inline-flex rounded-full")}>
              Back to PR list
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
