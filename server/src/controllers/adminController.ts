import { Request, Response } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Récupérer le secret depuis l'en-tête
    const adminSecret = req.headers['x-admin-secret'];
    
    // Vérifier s'il correspond à la variable d'environnement
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Récupérer tous les utilisateurs, en excluant le mot de passe
    const users = await User.find({}, '-password -__v').sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Erreur admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};