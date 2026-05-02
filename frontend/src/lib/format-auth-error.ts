import { ApiError } from "@/lib/api/client"

/** Turns mutation failures into user-visible strings (including typical Vercel ↔ Railway misconfig). */
export function formatAuthMutationError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    return err.message
  }
  if (err instanceof Error) {
    if (
      err.message === "Failed to fetch" ||
      err.message.includes("NetworkError when attempting to fetch resource") ||
      err.message.includes("Load failed")
    ) {
      return "Cannot reach the API. On Vercel set VITE_API_BASE_URL to your Railway URL including /api (e.g. https://your-service.up.railway.app/api). On Railway set CORS_ORIGIN to your exact Vercel origin (https://your-app.vercel.app). Redeploy both after changing env vars."
    }
    if (err.message.includes("VITE_API_BASE_URL")) {
      return err.message
    }
  }
  return fallback
}
