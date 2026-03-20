import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Quand on fait un POST sur /register, ça lance la fonction register
router.post('/register', register);

// Quand on fait un POST sur /login, ça lance la fonction login
router.post('/login', login);

export default router;