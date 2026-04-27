import express from "express"
import { validate } from "../middleware/validate.middleware.js"
import UserSchema from "../schema/user.schema.js"
import userController from "../controller/auth.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/signup', validate(UserSchema.createUser), userController.signupUser)

router.post('/signin', validate(UserSchema.signinUser), userController.signInUser)

export default router