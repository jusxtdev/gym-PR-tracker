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
            user_id: userId!
        }
    })

    // respond
    res.status(201).json({
        status: "success",
        data: {
            exercise_title,
            weight,
            reps,
            PR,
            userId
        }
    })

}

const getAllPr = async (req: Request, res: Response) => {
    const userId = req.userId

    const prForUser = await prisma.pR.findMany({
        where: {
            user_id: userId!
        },
        select: {
            id: true,
            exercise_title: true,
            remarks: true,
            weight: true,
            reps: true,
            PR: true,
            updated_at: true
        }
    })

    res.status(200).json({
        status: "success",
        data: prForUser
    })
}

const getPrById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const userId = req.userId

    const prForUser = await prisma.pR.findFirst({
        where: {
            user_id: userId!,
            id: id
        },
        select: {
            id: true,
            exercise_title: true,
            remarks: true,
            weight: true,
            reps: true,
            PR: true,
            updated_at: true
        }
    })

    if (!prForUser) {
        return res.status(404).json({
            status: 'failure',
            error: `Exercise with id ${id} not found`
        })
    }

    res.status(200).json({
        status: "success",
        data: prForUser
    })
}

const updatePrById = async (req: Request, res: Response) => {
    const prId = Number(req.params.id)
    const updateData = req.body

    const updatedPr = await prisma.pR.update({
        where: {
            id: prId
        },
        data: updateData,
        select: {
            id: true,
            exercise_title: true,
            remarks: true,
            weight: true,
            reps: true,
            PR: true,
            updated_at: true
        }
    })

    res.status(200).json({
        status: 'success',
        data: updatedPr
    })
}
const prController = { createPr, getAllPr, getPrById, updatePrById }

export default prController