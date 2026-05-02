import { z } from "zod"

/** Accepts numeric inputs from `<input type="number" />` / text fields. */
export const createPrSchema = z.object({
  exercise_title: z.string().min(1, "Exercise name is required"),
  remarks: z.string().optional(),
  weight: z.coerce.number().positive("Weight must be greater than 0"),
  reps: z.coerce
    .number()
    .int("Reps must be a whole number")
    .positive("Reps must be at least 1"),
})

/** Typed output after coercion (what we send to the API). */
export type CreatePrValues = z.output<typeof createPrSchema>

/** Form values before coercion (matches react-hook-form + number inputs). */
export type CreatePrFormValues = z.input<typeof createPrSchema>

export const updatePrSchema = createPrSchema.partial().extend({
  exercise_title: z.string().min(1, "Exercise name is required").optional(),
})

export type UpdatePrForm = z.infer<typeof updatePrSchema>
