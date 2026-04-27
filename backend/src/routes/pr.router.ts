import express, { type Request, type Response } from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import prSchema from "../schema/pr.schema.js"
import prController from "../controller/pr.controller.js"

const router = express.Router()

router.use(authMiddleware)

router.post('/', validate(prSchema.createPr), prController.createPr)

router.get('/', prController.getAllPr)

router.get('/:id', prController.getPrById)

// router.put('/:id', validate(prSchema.updatePr))

// router.delete('/:id')

export default router