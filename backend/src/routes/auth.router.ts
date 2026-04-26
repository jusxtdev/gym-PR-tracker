import express from "express"
import { validate } from "../middleware/validate.middleware.js"
import UserSchema from "../schema/user.schema.js"
import userController from "../controller/auth.controller.js"

const router = express.Router()

router.post('/', validate(UserSchema.createUser), userController.postUser)

export default router