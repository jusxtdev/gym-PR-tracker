import express from "express"

import authRouter from "./auth.router.js"
import prRouter from "./pr.router.js"

const router = express.Router()

router.get('/', (req, res) => {
    const data = {
        status: "success",
        msg: "Gym Personal Record Tracker"
    }
    res.render("index", data)
})

router.use('/auth', authRouter)
router.use('/pr', prRouter)

export default router