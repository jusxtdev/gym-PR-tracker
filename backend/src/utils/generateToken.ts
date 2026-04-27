import jwt from "jsonwebtoken"
import { env } from "../env.js"
import type { StringValue } from "ms"

const generateToken = (user: Object) => {
    const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as StringValue})
    return token
}

export default generateToken