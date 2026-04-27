import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { prisma } from "../config/db.js";
import generateToken from "../utils/generateToken.js";
import storeCookie from "../utils/storeCookie.js";

const postUser = async (req: Request, res: Response) => {
    const { username, password } = req.body

    // check if user already exists
    const exists = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (exists) {
        res
            .status(400)
            .json({
                staus: "failure",
                error: 'Username already exists'
            })
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // add new user
    const newUser = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    })

    // generate jwt token
    const payload = {
        id: newUser.id,
        username: newUser.username
    }
    const token = generateToken(payload)

    // add jwt to cookie
    storeCookie("jwt", token, res)

    // respond
    res.status(201).json({
        status : "success",
        data : {
            id : newUser.id,
            username : newUser.username,
        }
    })
}

const userController = { postUser }

export default userController