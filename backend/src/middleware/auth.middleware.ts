import jwt from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express";
import { env } from "../env.js";
import { prisma } from "../config/db.js";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // extract token from - Authorization header OR cookie
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies?.jwt) {
        console.log(req.cookies)
        token = req.cookies.jwt
    }

    try {
        // extract user object payload from token
        const decoded = jwt.verify(token, env.JWT_SECRET)

        // check if user exists
        console.log(decoded)

        // attach user object to req   
    } catch (error) {
        console.log(error)
    }
}

export default authMiddleware