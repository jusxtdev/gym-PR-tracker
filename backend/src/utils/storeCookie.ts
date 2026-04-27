import type { Response } from "express"
import { env } from "../env.js"

const storeCookie = (title: string, itemtoStore : any, res: Response) => {
    res.cookie(title, itemtoStore, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })
}

export default storeCookie