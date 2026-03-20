import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// --- AJOUTER UN POINT D'EAU / TOILETTE ---
export const addLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, type, description } = req.body;
    const userId = req.user.userId; // Récupéré grâce au middleware !

    // Validation basique
    if (!latitude || !longitude || !type) {
      res.status(400).json({ error: "Latitude, longitude et type sont requis." });
      return;
    }

    // Création dans la base de données (avec les noms de colonnes de ton camarade)
    const newLocation = await prisma.location.create({
      data: {
        loc_latitude: parseFloat(latitude), 
        loc_longitude: parseFloat(longitude),
        loc_type: type, // Doit être 'toilet' ou 'fountain' selon le SQL
        loc_desc: description || null,
        loc_available: true, // Disponible par défaut
        loc_created_by: userId,
        loc_creation_date: new Date()
      }
    });

    res.status(201).json({ message: "Lieu ajouté avec succès !", location: newLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'ajout du lieu." });
  }
};

// --- RÉCUPÉRER TOUS LES POINTS (Pour la Carte) ---
export const getLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // On ne récupère que les points disponibles (loc_available = true)
    const locations = await prisma.location.findMany({
      where: { loc_available: true }
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des lieux." });
  }
};