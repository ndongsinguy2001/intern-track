import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `"InternTrack" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
  }
};

export const sendStatusChangeEmail = async (
  userEmail: string,
  userName: string,
  company: string,
  position: string,
  oldStatus: string,
  newStatus: string
): Promise<void> => {
  const subject = `Mise à jour de votre candidature ${company}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">InternTrack - Mise à jour de candidature</h2>
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Le statut de votre candidature chez <strong>${company}</strong> pour le poste de <strong>${position}</strong> a été modifié.</p>
      <p style="font-size: 1.1em;">
        Ancien statut : <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${oldStatus}</span><br>
        Nouveau statut : <span style="background: #e0f2fe; padding: 4px 8px; border-radius: 4px; color: #0369a1; font-weight: bold;">${newStatus}</span>
      </p>
      <p>Connectez-vous à votre espace InternTrack pour plus de détails.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 0.9em;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  `;
  await sendEmail({ to: userEmail, subject, html });
};

// NOUVELLE FONCTION : Email de relance
export const sendReminderEmail = async (
  userEmail: string,
  userName: string,
  company: string,
  position: string,
  appliedDate: Date,
  daysSince: number
): Promise<void> => {
  const subject = `Relance pour votre candidature ${company}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">InternTrack - Pensez à relancer</h2>
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Votre candidature chez <strong>${company}</strong> pour le poste de <strong>${position}</strong> a été envoyée il y a ${daysSince} jours (le ${new Date(appliedDate).toLocaleDateString()}).</p>
      <p>Vous n'avez pas encore reçu de réponse ? C'est peut-être le moment d'envoyer une petite relance.</p>
      <p>Connectez-vous à votre espace InternTrack pour gérer vos candidatures.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 0.9em;">Cet email est un rappel automatique. Vous pouvez désactiver ces notifications dans les paramètres de votre compte (à venir).</p>
    </div>
  `;
  await sendEmail({ to: userEmail, subject, html });
};