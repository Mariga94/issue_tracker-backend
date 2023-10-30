import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

// Create a new project
export const create = async (req, res) => {
  try {
    // const name = req.body.name;
    const { name } = req.body;

    const userId = req.userId;
    const project = await User.createProject(name, userId);
    res.send(project);
  } catch (err) {
    console.log(err);
  }
};

// fetch one project by its id from the database
export const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await User.getProject(projectId);
    res.send(project).status(200);
  } catch (error) {
    res.send("Project not found").status(404);
  }
};
// fetch all projects from the database
export const getAllProjects = async (req, res) => {
  try {
    const projects = await User.getAllProjects();
    res.send(projects).status(200);
  } catch (error) {
    res.send(error.message).status(500);
  }
};

// delete one project by its ID from the database
export const deleteProject = async (req, res) => {};
