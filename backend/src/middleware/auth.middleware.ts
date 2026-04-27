import jwt, { type JwtPayload } from "jsonwebtoken"
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
        token = req.cookies.jwt
    }

    try {
        // extract user object payload from token
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload

        // check if user exists
        const userExists = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })
        if (!userExists) {
            return res.status(404).json({
                status: "failure",
                error: 'User not exists'
            })
        }

        // attach user object to req 
        req.userId = decoded.id

        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: "failure",
            error: "Invalid Token"
        })
    }
}

export default authMiddleware