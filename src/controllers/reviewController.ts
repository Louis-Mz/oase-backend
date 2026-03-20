// src/controllers/reviewController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getDistanceInMeters } from '../utils/distance';

const prisma = new PrismaClient();

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. On récupère les infos envoyées par l'appli Kotlin
    // Note : L'appli Kotlin DOIT nous envoyer la position actuelle de l'utilisateur !
    const { locationId, rating, comment, userLat, userLong } = req.body;
    const userId = req.user.userId;

    if (!locationId || !rating || !userLat || !userLong) {
      res.status(400).json({ error: "Il manque des informations (locationId, rating, userLat, userLong)." });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "La note doit être entre 1 et 5." });
      return;
    }

    // 2. Vérifier si le point d'eau existe
    const location = await prisma.location.findUnique({
      where: { loc_id: locationId }
    });

    if (!location) {
      res.status(404).json({ error: "Ce point d'eau n'existe pas." });
      return;
    }

    // 3. LA RÈGLE DES 300 MÈTRES (EF2) 🚨
    const distance = getDistanceInMeters(userLat, userLong, location.loc_latitude, location.loc_longitude);
    
    if (distance > 300) {
      res.status(403).json({ 
        error: `Vous êtes trop loin ! Vous devez être à moins de 300m (Distance actuelle: ${Math.round(distance)}m).` 
      });
      return;
    }

    // 4. LA RÈGLE "UNE FOIS PAR JOUR" (EF7) 📆
    const today = new Date();
    today.setHours(0, 0, 0, 0); // On remet l'heure à 00:00:00 pour cibler "aujourd'hui"

    const existingReviewToday = await prisma.reviews.findFirst({
      where: {
        r_written_by: userId,
        r_loc_id: locationId,
        r_created_on: { gte: today } // gte = Greater Than or Equal (Depuis ce matin 00h)
      }
    });

    if (existingReviewToday) {
      res.status(403).json({ error: "Vous avez déjà noté ce point d'eau aujourd'hui." });
      return;
    }

    // 5. Tout est bon, on sauvegarde l'avis !
    const newReview = await prisma.reviews.create({
      data: {
        r_rating: rating,
        r_comment: comment || null,
        r_written_by: userId,
        r_loc_id: locationId,
        r_created_on: new Date() // La date SQL demande un format précis, new Date() gère ça
      }
    });

    // 6. GAMIFICATION (EF5) : On donne +10 points à l'utilisateur pour sa contribution !
    await prisma.users.update({
      where: { u_id: userId },
      data: { u_score: { increment: 10 } }
    });

    res.status(201).json({ 
      message: "Merci pour votre avis ! Vous avez gagné 10 points.", 
      review: newReview 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout de l'avis." });
  }
};