import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import locationRoutes from './routes/locationRoutes';
import reviewRoutes from './routes/reviewRoutes';

const prisma = new PrismaClient();
// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Accepter les requêtes de l'extérieur
app.use(express.json()); // Comprendre le format JSON entrant

// --- BRANCHEMENT DES ROUTES ---
// Toutes les URLs qui commencent par /api/auth iront dans authRoutes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Serveur OASE Waterfinder est en ligne !');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});