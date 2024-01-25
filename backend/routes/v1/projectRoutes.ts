import { Router } from "express";
import authenticateUser from '../../middlewares/authMiddleware';
import * as ProjectControllers from "../../controllers/v1/projectControllers"
const router = Router();

router.post('/:workspaceId/projects', authenticateUser, ProjectControllers.createProject);
router.get('/:workspaceId/projects', authenticateUser, ProjectControllers.getProjects);
router.get('/:workspaceId/projects/:projectId', authenticateUser, ProjectControllers.getProject)
router.put('/:workspaceId/projects/:projectId', authenticateUser, ProjectControllers.updateProject);
router.delete('/:workspaceId/projects/:projectId', authenticateUser, ProjectControllers.deleteProject)

export default router