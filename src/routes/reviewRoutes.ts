// src/routes/reviewRoutes.ts
import { Router } from 'express';
import { addReview } from '../controllers/reviewController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/reviews -> Ajouter un avis (il faut être connecté)
router.post('/', verifyToken, addReview);

export default router;