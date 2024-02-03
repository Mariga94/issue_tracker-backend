import * as CommentServices from "../../services/v1/commentServices";
import { Request, Response } from "express";
interface AuthRequest extends Request {
    userId?: string
}
export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const { workspaceId, projectId, issueId } = req.params
        const userId: string | undefined = req.userId
        if (userId === undefined) {
            return res.status(401).json({ "message": "User is not authenticated", error: "Bad request" })
        }
        const newComment = await CommentServices.createComment(userId, issueId, req.body)
        return res.status(201).json({ "message": "Comment created successfully!", newComment })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong",
            error: "Internal Server Error"
        })
    }
}

export const getComments = async (req: AuthRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId
        const { issueId } = req.params
        if (userId === undefined) {
            return res.status(401).json({ "message": "User is not authenticated", error: "Bad request" })
        }
        const fetchedComments = await CommentServices.getComments(userId, issueId);
        res.status(200).json({
            "message": "fetchedComments successfully",
            data: fetchedComments
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong",
            error: "Internal Server Error"
        })
    }
}