import express from 'express';
import { register, login, logout, getProfile } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/profile', requireAuth, getProfile)

export default router;