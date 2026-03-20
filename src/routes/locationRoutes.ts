import { Router } from 'express';
import { addLocation, getLocations } from '../controllers/locationController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// On place verifyToken AVANT le contrôleur. 
// Si le token est mauvais, verifyToken bloque tout. Si c'est bon, ça passe à getLocations/addLocation.

// GET /api/locations -> Récupérer les points (il faut être connecté)
router.get('/', verifyToken, getLocations);

// POST /api/locations -> Ajouter un point (il faut être connecté)
router.post('/', verifyToken, addLocation);

export default router;