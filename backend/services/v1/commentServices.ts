import { Types } from "mongoose";
import CommentModel, { IComment } from "../../models/v1/commentModel";

export const createComment = async (userId: string, issueId: string, data: Partial<IComment>): Promise<IComment | null> => {
    try {
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(issueId)) {
            throw new Error(`UserId or issueId is null`)
        }
        const newComment = await CommentModel.create({ user: userId, issueId: issueId, ...data })
        return newComment;
    } catch (error) {
        throw new Error(`Error creating comment ${error}`)
    }
}

export const getComments = async (userId: string, issueId: string,): Promise<IComment[] | null> => {
    try {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error(`UserId or issueId is null`)
        }
        const fetchedComments = await CommentModel.find({ user: userId, issueId: issueId }).populate({
            path: 'user',
            select: 'fullName'
        })
        return fetchedComments;
    } catch (error) {
        throw new Error(`Error getting comment: ${error}`)
    }
}