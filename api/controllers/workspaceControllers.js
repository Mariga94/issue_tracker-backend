import Workspace from "../models/WorkSpaceModel.js";
export const createWorkspace = async (req, res) => {
  try {
    const newWorkspace = await Workspace.createWorkspace(
      req.body.name,
      req.userId
    );
    res.status(201).send(newWorkspace);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.getWorkspaces();
    res.status(200).send(workspaces);
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const workspaceById = await Workspace.getWorkspace(req.params.id);
    res.status(200).send(workspaceById);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    await Workspace.deleteWorkspace(req.params.id);
    res.status(200).send("workspace deleted");
  } catch (err) {
    res.status(500).send("Something went wrong!r");
  }
};

export const inviteUserToWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.inviteUserToWorkspace(
      req.params.id,
      req.body.email
    );
    res.status(201).send(workspace)
  } catch (error) {
    console.error(error);
  }
};

export const removeUserFromWorkspace = async (req, res) => {
    try {
      const workspace = await Workspace.removeUserFromWorkspace(
        req.params.id,
        req.body.userId
      );
      res.status(201).send(workspace)
    } catch (error) {
      console.error(error);
    }
  };

export const createProject = async (req, res) => {
  try {
    const newProject = await Workspace.createProject(
      req.params.id,
      req.body.name,
      req.userId
    );
    res.status(201).send(newProject);
  } catch (err) {
    console.error(err);
  }
};
