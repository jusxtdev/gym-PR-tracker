import jwt from "jsonwebtoken"
import { env } from "../env.js"
import type { StringValue } from "ms"

const generateToken = async (payload: Object) => {
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as StringValue})
    return token
}

export default generateToken