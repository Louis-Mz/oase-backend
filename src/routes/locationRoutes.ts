import { Router } from 'express';
import { addLocation, getLocations, getLocationById } from '../controllers/locationController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// On place verifyToken AVANT le contrôleur. 
// Si le token est mauvais, verifyToken bloque tout. Si c'est bon, ça passe à getLocations/addLocation.

// GET /api/locations -> Récupérer les points (il faut être connecté)
router.get('/', verifyToken, getLocations);

// POST /api/locations -> Ajouter un point (il faut être connecté)
router.post('/', verifyToken, addLocation);

// GET /api/locations/:id -> Détails d'un lieu (On ne met pas verifyToken ici car tout le monde peut voir une fontaine)
router.get('/:id', getLocationById); // <--- NOUVELLE ROUTE

export default router;