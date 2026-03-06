import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Application from '../models/Application';
import User from '../models/User';
import { sendStatusChangeEmail } from '../utils/emailService';

// Récupérer toutes les candidatures de l'utilisateur connecté
export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une candidature par ID
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, userId: req.userId });
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une nouvelle candidature
export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { company, position, status, appliedDate, link, notes } = req.body;
    const application = new Application({
      userId: req.userId,
      company,
      position,
      status,
      appliedDate,
      link,
      notes,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une candidature
export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, userId: req.userId });
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    // Sauvegarder l'ancien statut avant modification
    const oldStatus = application.status;

    // Mettre à jour les champs
    Object.assign(application, req.body);
    await application.save();

    // Vérifier si le statut a changé
    if (req.body.status && req.body.status !== oldStatus) {
      // Récupérer l'utilisateur pour avoir son nom et son email
      const user = await User.findById(req.userId);
      if (user) {
        // Envoyer l'email de notification (ne pas bloquer la réponse)
        sendStatusChangeEmail(
          user.email,
          user.name,
          application.company,
          application.position,
          oldStatus,
          application.status
        ).catch(err => console.error('Erreur envoi email:', err));
      }
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une candidature
export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.json({ message: 'Candidature supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};