import WorkspaceModel, { IWorkspace } from "../../models/v1/workspaceModel";
import UserModel from '../../models/v1/userModel';
import { Types } from "mongoose";


export const createWorkspace = async (userId: string, workspaceName: string): Promise<IWorkspace> => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw Error('User not found');
        }
        const newWorkspace = await WorkspaceModel.create({ workspaceName: workspaceName, owner: userId, members: [userId] });
        user.workspaces.push(newWorkspace._id)
        await newWorkspace.save()
        await user.save();
        return newWorkspace
    } catch (error: any) {
        throw Error(`Error creating workspace${error}`)
    }
}

export const getWorkspaces = async (): Promise<IWorkspace[]> => {
    try {
        const fetchedWorkspaces = await WorkspaceModel.find();
        return fetchedWorkspaces
    } catch (error) {
        throw new Error(`Error fetching workspaces ${error}`)
    }

}

export const getWorkspace = async (workspaceId: string): Promise<IWorkspace | null> => {
    try {
        //Tests whether a Strng is of 12 bytes i.e. valid mongo id
        if (!Types.ObjectId.isValid(workspaceId)) {
            throw new Error(`Invalid workspaceId: ${workspaceId}`)
        }
        const fetchWorkspace = await WorkspaceModel.findById(workspaceId);
        return fetchWorkspace
    } catch (error) {
        throw new Error(`Error fetching workspace: ${error}`)
    }
}

export const deleteWorkspace = async (workspaceId: string): Promise<IWorkspace | null> => {
    try {
        //Tests whether a Strng is of 12 bytes i.e. valid mongo id
        if (!Types.ObjectId.isValid(workspaceId)) {
            throw new Error(`Invalid workspaceId: ${workspaceId}`)
        }

        const deletedWorkspace = await WorkspaceModel.findOneAndDelete({ _id: workspaceId });
        if (!deletedWorkspace) {
            return null;
        }

        return deletedWorkspace as unknown as IWorkspace
    } catch (error) {
        console.error(error)
        throw new Error(`Error deleting workspace: ${error}`)
    }
}