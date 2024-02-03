import * as ProjectServices from '../../services/v1/projectServices';
import { Request, Response } from 'express';

interface AuthenticateRequest extends Request {
    userId?: string;

}

export const createProject = async (req: AuthenticateRequest, res: Response) => {
    try {
        const userId: string | undefined = req.userId;
        const { workspaceId } = req.params;
        const { projectName } = req.body;
        console.log(workspaceId, userId)
        if (userId === undefined) {
            return res.status(400).json({
                "error": "Bad request",
                "message": "User is not authenticated. Please sign in"
            })
        } else if (!workspaceId) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "Invalide workspaceId"
            })
        } else {

            const newProject = await ProjectServices.createProject(userId, workspaceId, projectName);
            return res.status(201).json({
                "message": "New Project created successfully",
                data: newProject
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unpexpected error occured while processing the request"
        })
    }
}

export const getProjects = async (req: AuthenticateRequest, res: Response) => {
    try {
        const { workspaceId } = req.params;
        const userId: string | undefined = req.userId;
        if (userId === undefined) {
            return res.status(400).json({
                "error": "Bad request",
                "message": "User is not authenticated. Please sign in"
            })
        } else if (!workspaceId) {
            return res.status(400).json({ "error": "Bad request", "message": "Invalid workspaceId " })
        }
        const fetchedProjects = await ProjectServices.getProjects(workspaceId, userId);
        res.status(200).json({ "message": "Projects fetched successfully", "data": fetchedProjects })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unpexpected error occured while processing the request"
        })
    }
}

export const getProject = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId } = req.params;
        if (!workspaceId || !projectId) {
            res.status(400).json({ "error": "Bad Request", "message": "Invalid workspaceId or project Id" })
        }
        const fetchedProject = await ProjectServices.getProject(workspaceId, projectId);
        res.status(200).json({ "message": "Project fetched successfully", "data": fetchedProject })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unpexpected error occured while processing the request"
        })
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId } = req.params;


        if (!workspaceId || !projectId) {
            return res.status(400).json({ "error": "Invalid workpsaceId or projectId" })
        }

        if (!req.body) {
            return res.status(400).json({ "error": "Request body cannot be empty" })
        }
        const updatedProject = await ProjectServices.updateProject(workspaceId, projectId, req.body);
        res.status(201).json({ "message": "Project Updated successfully", "data": updatedProject })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unpexpected error occured while processing the request"
        })
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { workspaceId, projectId } = req.params;

        if (!workspaceId || !projectId) {
            return res.status(400).json({ "error": "Invalid workpsaceId or projectId" })
        }

        const updatedProject = await ProjectServices.deleteProject(workspaceId, projectId);
        res.status(201).json({ "message": "Project deleted successfully", "data": updatedProject })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": "An unpexpected error occured while processing the request"
        })
    }
}