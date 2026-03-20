import { Request, Response } from 'express';
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
// --- RÉCUPÉRER TOUS LES POINTS (Avec Filtres EF4) ---
export const getLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // On récupère le paramètre "type" s'il y en a un dans l'URL (?type=toilet)
    const filterType = req.query.type as string;

    // On prépare les conditions de recherche pour la Base de Données
    // De base, on veut tous les points disponibles
    let whereCondition: any = { 
      loc_available: true 
    };

    // Si l'équipe React a demandé un type précis (toilet ou fountain)
    if (filterType === 'toilet' || filterType === 'fountain') {
      whereCondition.loc_type = filterType; // On ajoute le filtre à la condition
    }

    // On cherche dans la BDD avec nos conditions
    const locations = await prisma.location.findMany({
      where: whereCondition
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des lieux." });
  }
};

// --- RÉCUPÉRER UN LIEU SPÉCIFIQUE AVEC SA NOTE MOYENNE ---
export const getLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // L'ID passé dans l'URL (ex: /api/locations/1)

    // 1. On rassure TypeScript : si pas d'ID ou si ce n'est pas un nombre, on arrête tout
    if (!id || isNaN(parseInt(id))) {
      res.status(400).json({ error: "ID invalide ou manquant." });
      return;
    }

    const locationId = parseInt(id, 10); // Le "10" précise qu'on compte en base 10

    // 2. On cherche le lieu ET on inclut tous ses avis (reviews) liés
    const location = await prisma.location.findUnique({
      where: { loc_id: locationId },
      include: {
        reviews: {
          select: {
            r_id: true,
            r_rating: true,
            r_comment: true,
            r_created_on: true,
            users: { select: { u_name: true } } // Relation correcte avec la BDD !
          }
        }
      }
    });

    if (!location) {
      res.status(404).json({ error: "Point d'eau introuvable." });
      return;
    }

    // Calcul de la note moyenne mathématique
    let averageRating = 0;
    if (location.reviews.length > 0) {
      const sum = location.reviews.reduce((acc, review) => acc + review.r_rating, 0);
      averageRating = sum / location.reviews.length;
    }

    // On renvoie un bel objet formaté pour l'équipe React
    res.status(200).json({
      locationDetails: location,
      totalReviews: location.reviews.length,
      averageRating: parseFloat(averageRating.toFixed(1))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du lieu." });
  }
};