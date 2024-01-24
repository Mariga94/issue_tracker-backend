import { Request, Response } from 'express';
import * as UserServices from "../../services/v1/userServices";
import { error } from 'console';

interface AuthenticationRequest extends Request {
    userId?: string;
}
export const updateUserProfile = async (req: AuthenticationRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId
        if (userId === undefined) {
            return res.send(400).json({error:"userId cannot be undefined"})
            // throw new Error('userId is undefined')
        }
        const data = req.body;
        if (!Object.keys(data).length) {
            return res.send(400).send({error:"request body cannot be empty."})
            // throw new Error('data is undefined')
        }
        console.log(userId, data)
        const user = await UserServices.updateUserProfile(userId, {...data})
        return res.status(200).json({ message: "User Updated", user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('id', id)
        if (!id) {
            return res.status(400).json({ error: "Please provide a valid id" })
        }
        const user = await UserServices.getUser(id)
        return res.status(200).json({ message: "User fetch successfully", user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserServices.getUsers()
        return res.status(200).json({ message: "User fetch successfully", users })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}