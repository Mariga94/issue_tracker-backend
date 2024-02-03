import { Router } from "express";
import authenticateUser from '../../middlewares/authMiddleware';
import * as IssueControllers from '../../controllers/v1/issueControllers';

const router = Router();

router.post('/:workspaceId/projects/:projectId', authenticateUser, IssueControllers.createIssue)
router.get('/:workspaceId/projects/:projectId/issues', authenticateUser, IssueControllers.getIssues)
router.get('/:workspaceId/projects/:projectId/issues/:issueId', authenticateUser, IssueControllers.getIssue)
router.put('/:workspaceId/projects/:projectId/issues/:issueId', authenticateUser, IssueControllers.updateIssue)
router.patch('/:workspaceId/projects/:projectId/issues/:issueId/status', authenticateUser, IssueControllers.updateStatus)
router.delete('/:workspaceId/projects/:projectId/issues/:issueId', authenticateUser, IssueControllers.deleteIssue)

export default router;
