import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- RÉCUPÉRER LE CLASSEMENT (LEADERBOARD) ---
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // On demande à Prisma de chercher les utilisateurs, 
    // de les trier par score décroissant (desc), et d'en prendre seulement 10.
    const topUsers = await prisma.users.findMany({
      orderBy: {
        u_score: 'desc'
      },
      take: 10,
      select: {
        u_id: true,
        u_name: true,
        u_score: true
        // On NE SÉLECTIONNE SURTOUT PAS le mot de passe ou l'email ici !
      }
    });

    res.status(200).json(topUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du classement." });
  }
};