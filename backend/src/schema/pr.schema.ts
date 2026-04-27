import { z } from "zod"

const createPr = z.object({
    exercise_title: z.string(),
    remarks: z.string().optional(),
    weight: z.float64(),
    reps: z.number()
})

const updatePr = createPr.partial()

const prSchema = { createPr, updatePr }

export default prSchema