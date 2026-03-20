import { Router } from 'express';
import { getLeaderboard } from '../controllers/userController';

const router = Router();

// GET /api/users/leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;