import { getStoredToken } from "@/lib/auth-token"

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

function getErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error: unknown }).error
    if (typeof err === "string") return err
  }
  return "Request failed"
}

function getBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base) {
    throw new Error("VITE_API_BASE_URL is not set")
  }
  return base.replace(/\/$/, "")
}

export type ApiRequestOptions = RequestInit & {
  /** Set true for public routes (sign in / sign up) so an old token is not sent. */
  skipAuth?: boolean
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth, headers: initHeaders, ...rest } = options
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`

  const headers = new Headers(initHeaders)
  if (!headers.has("Content-Type") && rest.body && typeof rest.body === "string") {
    headers.set("Content-Type", "application/json")
  }
  if (!skipAuth) {
    const token = getStoredToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    credentials: "include",
  })

  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      throw new ApiError(res.status, text, "Server returned non-JSON")
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, data, getErrorMessage(data))
  }

  return data as T
}
