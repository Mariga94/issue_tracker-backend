import { Router } from 'express';
import authenticateUser from '../../middlewares/authMiddleware';
import * as commentControllers from "../../controllers/v1/commentControllers"
const router = Router()

router.post('/:workspaceId/projects/:projectId/issues/:issueId/comments', authenticateUser, commentControllers.createComment)
router.get('/:workspaceId/projects/:projectId/issues/:issueId/comments', authenticateUser, commentControllers.getComments)

export default router