import express, { type Request, type Response } from "express"
import authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router()

router.get('/', authMiddleware, async (req : Request, res : Response) => {
    res.send("YOUR pr's")
})

export default router