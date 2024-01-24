import express from 'express';
import { getUser, getUsers, updateUserProfile } from '../../controllers/v1/userController';
import authenticateUser from '../../middlewares/authMiddleware'

const router = express.Router();

// Sign up new User
router.get('/', authenticateUser, getUsers);
router.put('/update-profile', authenticateUser, updateUserProfile)
router.get('/:id', authenticateUser, getUser);



export default router