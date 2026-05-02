import { apiFetch } from "@/lib/api/client"

type SignInResponse = {
  status: string
  data: {
    token: string
  }
}

type SignUpResponse = {
  status: string
  data: {
    id: number
    username: string
    token: string
  }
}

export async function signIn(username: string, password: string): Promise<string> {
  const res = await apiFetch<SignInResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    skipAuth: true,
  })
  return res.data.token
}

export async function signUp(username: string, password: string): Promise<string> {
  const res = await apiFetch<SignUpResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    skipAuth: true,
  })
  return res.data.token
}

export async function logout(): Promise<void> {
  await apiFetch<{ status: string }>("/auth/logout", {
    method: "POST",
  })
}
