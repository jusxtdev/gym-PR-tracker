import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

const createPr = async (req: Request, res: Response) => {
    const { exercise_title, remarks, weight, reps } = req.body
    const userId = req.userId

    // check if exercise already exists
    const exerciseExists = await prisma.pR.findUnique({
        where: {
            user_id_exercise_title: {
                user_id: userId!,
                exercise_title: exercise_title
            }
        }
    })
    if (exerciseExists) {
        return res.status(400).json({
            status: "failure",
            error: 'Exercise already exists'
        })
    }

    // calculate PR (personal record) = maximum weight * maximum reps you did for that weight || PR = weight * reps
    const PR = weight * reps

    // add new exercise
    const newExercise = await prisma.pR.create({
        data: {
            exercise_title,
            remarks,
            weight,
            reps,
            PR,
            user_id :userId!
        }
    })

    // respond
    res.status(201).json({
        status : "success",
        data : {
            exercise_title,
            weight,
            reps,
            PR,
            userId
        }
    })

}

const prController = { createPr }

export default prController