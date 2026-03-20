import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- INSCRIPTION (REGISTER) ---
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. On récupère ce que l'appli Kotlin nous envoie
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Tous les champs sont requis." });
      return;
    }

    // 2. Vérifier si l'email existe déjà dans la DB
    const existingUser = await prisma.users.findUnique({ where: { u_mail: email } });
    if (existingUser) {
      res.status(409).json({ error: "Cet email est déjà utilisé." });
      return;
    }

    // 3. Sécuriser le mot de passe (Hachage)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Sauvegarder dans la DB (en respectant les colonnes du camarade)
    const newUser = await prisma.users.create({
      data: {
        u_name: username,
        u_mail: email,
        u_password: hashedPassword,
        u_score: 0, // Score de départ
        u_creation_date: new Date()
      }
    });

    res.status(201).json({ message: "Utilisateur créé avec succès !", userId: newUser.u_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
};

// --- CONNEXION (LOGIN) ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Chercher l'utilisateur par son email
    const user = await prisma.users.findUnique({ where: { u_mail: email } });
    if (!user) {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
      return;
    }

    // 2. Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.u_password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
      return;
    }

    // 3. Créer le Token JWT (le "badge" de l'utilisateur)
    const token = jwt.sign(
      { userId: user.u_id, username: user.u_name }, 
      JWT_SECRET, 
      { expiresIn: '30d' } // Valable 30 jours
    );

    res.status(200).json({ 
      message: "Connexion réussie !", 
      token: token,
      user: { id: user.u_id, username: user.u_name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
};