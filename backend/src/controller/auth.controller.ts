import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { prisma } from "../config/db.js";
import generateToken from "../utils/generateToken.js";
import storeCookie from "../utils/storeCookie.js";

const signupUser = async (req: Request, res: Response) => {
    const { username, password } = req.body

    // check if user already exists
    const exists = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (exists) {
        return res
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
        status: "success",
        data: {
            id: newUser.id,
            username: newUser.username,
            token
        }
    })
}

const signInUser = async (req: Request, res: Response) => {
    const { username, password } = req.body
    
    // check if userExists
    const user = await prisma.user.findUnique({
        where : {
            username : username
        }
    })
    if (!user) { 
        return res.status(404).json({
            status : "failure",
            error : "User Not Found"
        })
    }

    // validate password
    const isValidPassword = await bcrypt.compare(password, user!.password)
    if (!isValidPassword){
        return res.status(400).json({
            status : "failure",
            error : "Incorrect Password"
        })
    }

    // generate token
    const payload = {
        id: user!.id,
        username: user!.username
    }
    const token = generateToken(payload)

    // store token in cookie
    storeCookie("jwt", token, res)

    // respond
    res.status(200).json({
        status : "success",
        data : {
            token
        }
    })
}

const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie("jwt")
    res.status(200).json({
        status : "success",
        msg : "Logged out successfully"
    })
}

const userController = { signupUser, signInUser, logoutUser}

export default userController