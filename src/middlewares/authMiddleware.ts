import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// On crée une interface personnalisée pour ajouter "user" à la requête
export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Récupérer le header "Authorization" envoyé par l'appli Kotlin
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Accès refusé. Token manquant." });
    return;
  }

  // 2. Extraire le token (on enlève le mot "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Vérifier si le token est valide (pas expiré, pas falsifié)
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. On attache les infos de l'utilisateur (userId) à la requête
    req.user = decoded;
    
    // 5. On laisse passer à la suite (le contrôleur)
    next();
  } catch (error) {
    res.status(403).json({ error: "Token invalide ou expiré." });
  }
};