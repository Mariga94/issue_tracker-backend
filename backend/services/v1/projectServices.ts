import { Types } from "mongoose";
import ProjectModel, { IProject } from "../../models/v1/projectModel";
import WorkspaceModel from '../../models/v1/workspaceModel'

export const createProject = async (userId: string, workspaceId: string, projectName: string): Promise<IProject> => {
    try {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error(`Invalid userId`)
        }
        if (!Types.ObjectId.isValid(workspaceId)) {
            throw new Error(`Invalid workspaceId: ${workspaceId}`);
        }
        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace cannot be null, provide valid Id or create new workspace`);
        }
        const newProject = await ProjectModel.create({ projectName: projectName, owner: userId, workspace: workspaceId });
        await newProject.save();
        workspace.projects?.push(newProject._id)
        await workspace.save();
        return newProject
    } catch (error) {
        console.log(error);
        throw Error(`Error creating project: ${error}`)
    }

}

export const getProjects = async (workspaceId: string): Promise<IProject[] | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId)) {
            throw new Error('Invalid workspaceId')
        }
        console.log('workspaceId', workspaceId)
        const fetchedProjects = await ProjectModel.find({ workspace: workspaceId });
        return fetchedProjects
    } catch (error) {
        console.log(error);
        throw Error(`Error fetching projects: ${error}`)
    }
}

export const getProject = async (workspaceId: string, projectId: string): Promise<IProject | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId)) {
            throw new Error('WorkspaceId is invalid')
        } else if (!Types.ObjectId.isValid(projectId)) {
            throw new Error('ProjectId is invalid')
        }
        const fetchProject = await ProjectModel.findOne({ workspace: workspaceId, _id: projectId });
        return fetchProject
    } catch (error) {
        console.error(error);
        throw Error(`Cannot fetch project by Id: ${error}`)
    }
}


export const updateProject = async (workspaceId: string, projectId: string, updateData: Partial<IProject>): Promise<IProject | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId)) {
            throw new Error('Error: Invalid workpsaceId or projectId');
        }

        const updatedProject = await ProjectModel.findOneAndUpdate({ workspace: workspaceId, _id: projectId }, updateData, { new: true });
        return updatedProject

    } catch (error) {
        console.error(error);
        throw new Error(`Error updating project ${error}`)
    }
}


export const deleteProject = async (workspaceId: string, projectId: string): Promise<IProject | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId)) {
            throw new Error('Error: Invalid workpsaceId or projectId');
        }

        const deletedProject = await ProjectModel.findOneAndDelete({ workspace: workspaceId, _id: projectId });
        const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(workspaceId, { $pull: { projects: projectId }, new: true });
        if (!deletedProject || !updatedWorkspace) {

            throw new Error('Project or Workspace not found');
        }
        return deletedProject

    } catch (error) {
        console.error(error);
        throw new Error(`Error deleting project: ${error}`)
    }
}