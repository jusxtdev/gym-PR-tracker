import { apiFetch } from "@/lib/api/client"
import type { PrRecord } from "@/types/pr"

type ListResponse = {
  status: string
  data: PrRecord[]
}

type CreateResponse = {
  status: string
  data: {
    newExercise: PrRecord
  }
}

type SingleResponse = {
  status: string
  data: PrRecord
}

export async function listPrs(): Promise<PrRecord[]> {
  const res = await apiFetch<ListResponse>("/pr/", { method: "GET" })
  return res.data
}

export async function getPr(id: number): Promise<PrRecord> {
  const res = await apiFetch<SingleResponse>(`/pr/${id}`, { method: "GET" })
  return res.data
}

export async function createPr(body: {
  exercise_title: string
  remarks?: string
  weight: number
  reps: number
}): Promise<PrRecord> {
  const res = await apiFetch<CreateResponse>("/pr/", {
    method: "POST",
    body: JSON.stringify(body),
  })
  return res.data.newExercise
}

export async function updatePr(
  id: number,
  body: Partial<{
    exercise_title: string
    remarks: string | undefined
    weight: number
    reps: number
  }>
): Promise<PrRecord> {
  const res = await apiFetch<SingleResponse>(`/pr/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  return res.data
}

export async function deletePr(id: number): Promise<PrRecord> {
  const res = await apiFetch<SingleResponse>(`/pr/${id}`, {
    method: "DELETE",
  })
  return res.data
}
