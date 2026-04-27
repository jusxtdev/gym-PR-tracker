import express from "express"
import { validate } from "../middleware/validate.middleware.js"
import UserSchema from "../schema/user.schema.js"
import userController from "../controller/auth.controller.js"

const router = express.Router()

router.post('/signup', validate(UserSchema.createUser), userController.signupUser)

router.post('/signin', validate(UserSchema.signinUser), userController.signInUser)

router.post('/logout', userController.logoutUser)

export default router