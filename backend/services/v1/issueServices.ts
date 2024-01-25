import { Types } from "mongoose";
import IssueModel, { IIssue } from "../../models/v1/issueModel";
import ProjectModel from "../../models/v1/projectModel";
import WorkspaceModel from "../../models/v1/workspaceModel"

export const createIssue = async (userId: string, workspaceId: string, projectId: string, issueData: Partial<IIssue>): Promise<IIssue> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid workspaceId, projectId or userId")
        }

        const newIssue = await IssueModel.create({ workspace: workspaceId, project: projectId, reporter: userId, ...issueData });
        newIssue.save();
        const updatedProject = await ProjectModel.findById(projectId);
        updatedProject?.issues.push(newIssue._id);
        updatedProject?.save();
        const updatedWorkspaces = await WorkspaceModel.findById(workspaceId);
        updatedWorkspaces?.issues?.push(newIssue._id);
        return newIssue
    } catch (error) {
        console.error(error);
        throw new Error(`Error creating Issue ${error}`)
    }

}

export const getIssues = async (workspaceId: string, projectId: string): Promise<IIssue[] | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId)) {
            throw new Error("Invalid workspaceId or projectId")
        }
        const fetchedIssues = await IssueModel.find({ workspace: workspaceId, project: projectId });
        return fetchedIssues
    } catch (error) {
        console.error(error);
        throw new Error(`Error getting issues: ${error}`)
    }
}

export const getIssue = async (workspaceId: string, projectId: string, issueId: string): Promise<IIssue | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId)) {
            throw new Error("Invalid workspaceId or projectId")
        }
        const fetchedIssue = await IssueModel.findOne({ workspace: workspaceId, project: projectId, _id: issueId });
        return fetchedIssue
    } catch (error) {
        console.error(error);
        throw new Error(`Error getting issues: ${error}`)
    }
}

export const updateIssue = async (workspaceId: string, projectId: string, issueId: string, updatedData: Partial<IIssue>) => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(issueId)) {
            throw new Error("Invalid workspaceId or projectId")
        }
        const updatedIssue = await IssueModel.findOneAndUpdate({ workspace: workspaceId, project: projectId, _id: issueId }, updatedData, { new: true });
        return updatedIssue
    } catch (error) {
        console.error(error);
        throw new Error(`Error getting issues: ${error}`)
    }
}

export const deleteIssue = async (workspaceId: string, projectId: string, issueId: string): Promise<IIssue | null> => {
    try {
        if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(issueId)) {
            throw new Error("Invalid workspaceId or projectId")
        }
        const deletedIssue = await IssueModel.findOneAndDelete({ workspace: workspaceId, project: projectId, _id: issueId });
        const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, { $pull: { issues: issueId } }, { new: true });
        const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(workspaceId, { $pull: { issues: issueId } }, { new: true });
       
        return deletedIssue;
    } catch (error) {
        console.error(error);
        throw new Error(`Error getting issues: ${error}`)
    }
}