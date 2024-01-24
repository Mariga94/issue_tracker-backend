import express from 'express';
import { signIn, signOut, signUp } from '../../controllers/v1/authControllers';

const router = express.Router();

// Sign up new User
router.post('/sign-up', signUp);

// Sign in user
router.post('/sign-in', signIn);

// Sign out user
router.post('/sign-out', signOut);

router.get('/',(req, res) => {
    res.status(200).json({message:"Connected to auth"})
})

export default router
