import { Router } from "express"
import authenticateUser from '../../middlewares/authMiddleware';
import * as workspaceControllers from "../../controllers/v1/workspaceControllers"
const router = Router()

router.get('/', authenticateUser, workspaceControllers.getWorkspaces);
router.get('/:workspaceId', authenticateUser, workspaceControllers.getWorkspace);
router.post('/', authenticateUser, workspaceControllers.createWorkspace);
router.delete('/:workspaceId', authenticateUser, workspaceControllers.deleteWorkspace);


export default router;