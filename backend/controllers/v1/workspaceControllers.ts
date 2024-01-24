import { IWorkspace } from "../../models/v1/workspaceModel";
import * as workspaceServices from "../../services/v1/workspaceServices";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const createWorkspace = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId;
        const { workspaceName } = req.body;
        if (userId === undefined) {
            return res.status(401).json({ "error": "Bad Request", "message": 'User is not authenticated.Please sign in' })
        } else if (!workspaceName) {
            return res.status(400).json({ "error": "Bad Request", "message": "Missing required field: [workspaceName]" })
        } else {
            const newWorkspace = await workspaceServices.createWorkspace(userId, workspaceName);
            res.status(201).json({ "message": "New workspace created successfully", data: newWorkspace })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ "error": "Internal Server Error", message: "An unexpected error occured while processing the request" })
    }
}

export const getWorkspaces = async (req: Request, res: Response) => {
    try {
        const workspaces = await workspaceServices.getWorkspaces();
        res.status(200).json({ "message": "Workspaces fetched successfully", "data": workspaces })
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error", message: "An unexpected error occured while processing the request" })
    }
}

export const getWorkspace = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params;
        console.log(req.params)
        if (!workspaceId) {
            res.status(400).json({
                "error": "Bad request",
                "messsage": "Invalid workspaceId"
            })
        }
        const workspace = await workspaceServices.getWorkspace(workspaceId);
        res.status(200).json({
            "message": "Workspace fetched successfully",
            "data": workspace
        });
    } catch (error) {
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unexpected error occured while processing the request"
        })
    }
}

export const deleteWorkspace = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params;
        console.log(workspaceId)
        if (!workspaceId) {
            res.status(400).json({
                "error": "Bad request",
                "messsage": "Invalid workspaceId"
            })
        }
        const deletedWorkspace = await workspaceServices.deleteWorkspace(workspaceId);
        res.status(200).json({
            "message": "Workspace deleted successfully",
            "data": deletedWorkspace
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unexpected error occured while processing the request"
        })
    }
}