import { z } from "zod"

const createUser = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
})

const signinUser = createUser

const updateUser = createUser.partial()

const UserSchema = { createUser, signinUser, updateUser }

export default UserSchema