import cron from 'node-cron';
import axios from 'axios'; // ou utiliser la fonction directement

// Importer la fonction de rappel (pour éviter d'appeler HTTP)
import { sendReminders } from '../controllers/cronController';
import { Request, Response } from 'express';

// On va créer une fonction wrapper qui simule un objet req/res
const runReminders = async () => {
  console.log('Exécution du cron job de relances...');
  // Créer de faux objets req et res
  const req = { query: { secret: process.env.CRON_SECRET } } as unknown as Request;
  const res = {
    json: (data: any) => console.log('Résultat du cron:', data),
    status: (code: number) => ({
      json: (data: any) => console.log(`Erreur ${code}:`, data)
    })
  } as Response;

  await sendReminders(req, res);
};

// Planifier tous les jours à 8h du matin
cron.schedule('0 8 * * *', runReminders, {
  scheduled: true,
  timezone: 'Europe/Paris'
});

console.log('Cron job planifié pour les relances (tous les jours à 8h).');