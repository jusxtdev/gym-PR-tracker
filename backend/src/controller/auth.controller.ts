import type { Request, Response } from "express";

const postUser = (req: Request, res: Response) => {
    res.send('USER SIGNUP ROUTE')
}

const userController = {postUser}

export default userController