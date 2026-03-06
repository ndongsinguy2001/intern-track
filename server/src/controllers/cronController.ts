import { Request, Response } from 'express';
import Application from '../models/Application';
import User from '../models/User';
import { sendReminderEmail } from '../utils/emailService';

// Configuration : délai avant relance en jours (paramétrable)
const REMINDER_DAYS = 15; // Vous pouvez rendre cela configurable plus tard

export const sendReminders = async (req: Request, res: Response) => {
  try {
    // Vérification du secret pour sécuriser l'appel
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const now = new Date();
    const reminderDate = new Date(now.getTime() - REMINDER_DAYS * 24 * 60 * 60 * 1000);

    // Trouver toutes les candidatures en cours avec appliedDate <= reminderDate
    // et dont la dernière relance est trop ancienne ou nulle
    const applications = await Application.find({
      status: 'en cours',
      appliedDate: { $lte: reminderDate },
      $or: [
        { lastReminder: { $exists: false } },
        { lastReminder: null },
        { lastReminder: { $lte: reminderDate } } // si dernière relance avant reminderDate (pour éviter de spammer)
      ]
    });

    let remindersSent = 0;
    for (const app of applications) {
      // Récupérer l'utilisateur associé
      const user = await User.findById(app.userId);
      if (!user) continue;

      // Envoyer l'email
      const daysSince = Math.floor((now.getTime() - app.appliedDate.getTime()) / (1000 * 60 * 60 * 24));
      await sendReminderEmail(
        user.email,
        user.name,
        app.company,
        app.position,
        app.appliedDate,
        daysSince
      );

      // Mettre à jour les champs de relance
      app.lastReminder = now;
      app.reminderCount = (app.reminderCount || 0) + 1;
      await app.save();

      remindersSent++;
    }

    res.json({
      message: 'Relances envoyées',
      count: remindersSent,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des relances:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};