import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

export const validate = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    const valid = schema.safeParse(data)

    if (!valid.success) {
        const errorMessage = valid.error.issues.map((issue) => issue.message).join(' | ')
        return res.status(400).json({
            status: 'failure',
            error: errorMessage
        })
    }
    next()
}