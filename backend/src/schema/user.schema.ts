import { z } from "zod"

const createUser = z.object({
    username : z.string().min(3),
    password : z.string().min(3),
})

const updateUser = createUser.partial()

const UserSchema = {createUser, updateUser}

export default UserSchema