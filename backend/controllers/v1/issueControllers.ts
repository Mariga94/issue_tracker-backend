import * as IssueServices from '../../services/v1/issueServices'
import { Request, Response } from 'express'

interface AuthenticateRequest extends Request {
    userId?: string;

}

export const createIssue = async (req: AuthenticateRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId;
        const { workspaceId, projectId } = req.params;
        if (userId === undefined) {
            return res.status(400).json({
                "error": "Bad request",
                "message": "User is not authenticated. Please sign in"
            })
        } else if (!workspaceId || !projectId) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "workspaceId or projectId is invalid"
            });
        } else {
            const newIssue = await IssueServices.createIssue(userId, workspaceId, projectId, req.body);
            res.status(201).json({
                "message": "Issue created successfully",
                "data": newIssue
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Interval Server Error", "message": "Something went wrong." });
    }
}

export const getIssues = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId } = req.params;
        if (!workspaceId || !projectId) {
            return res.status(400).json({ "error": "Bad Request", "message": "Invalid workspaceId or projectId" })
        }
        const fetchedIssues = await IssueServices.getIssues(workspaceId, projectId);
        return res.status(200).json({ "message": "Issues fetched successfully", "data": fetchedIssues })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Interval Server Error",
            "message": "Something went wrong."
        });
    }
}

export const getIssue = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;
        if (!workspaceId || !projectId || !issueId) {
            return res.status(400).json({ "error": "Bad Request", "message": "Invalid workspaceId or issueId or projectId" })
        }
        const fetchedIssue = await IssueServices.getIssue(workspaceId, projectId, issueId);
        return res.status(200).json({ "message": "Issue fetched successfully", "data": fetchedIssue })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Interval Server Error",
            "message": "Something went wrong."
        });
    }
}

export const updateIssue = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;
        if (!workspaceId || !projectId || !issueId) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "Invalid workspaceId or issueId or projectId"
            })
        } else if (!req.body) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "Request body cannot be empty"
            })
        }
        const updatedIssue = await IssueServices.updateIssue(workspaceId, projectId, issueId, req.body);
        return res.status(201).json({ "message": "Issue updated successfully", "data": updatedIssue })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Interval Server Error",
            "message": "Something went wrong."
        });
    }
}

export const deleteIssue = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;
        if (!workspaceId || !projectId || !issueId) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "Invalid workspaceId or issueId or projectId"
            });
        }
        const deletedIssue = await IssueServices.deleteIssue(workspaceId, projectId, issueId);
        res.status(200).json({ "message": "Issue deleted successfully", "data": deletedIssue })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Interval Server Error",
            "message": "Something went wrong."
        });
    }
}


export const updateStatus = async (req: AuthenticateRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId
        if (userId === undefined) {
            return res.status(400).json({
                "error": "Bad request",
                "message": "User is not authenticated. Please sign in"
            })
        }
        const { status } = req.body
        const { workspaceId, projectId, issueId } = req.params
        const updatedIssue = await IssueServices.updateStatus(userId, workspaceId, projectId, issueId, status)
        res.status(200).json({
            "message": "Status update successfully",
            "data": updatedIssue
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Interval Server Error",
            "message": "Something went wrong."
        });
    }
}

export const updatePriority = async (req: AuthenticateRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId
        if (userId === undefined) {
            return res.status(400).json({
                "error": "Bad request",
                "message": "User is not authenticated. Please sign in"
            })
        }
        const { priority } = req.body
        const { workspaceId, projectId, issueId } = req.params
        const updatedIssue = await IssueServices.updatePriority(userId, workspaceId, projectId, issueId, priority)
        res.status(200).json({
            "message": "Priority update successfully",
            "data": updatedIssue
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Interval Server Error",
            "message": "Something went wrong."
        });
    }
}

