import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  position: string;
  status: 'en cours' | 'entretien' | 'refusé' | 'accepté';
  appliedDate: Date;
  link?: string;
  notes?: string;
  attachments?: { fileName: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
  lastReminder?: Date;       // date de la dernière relance envoyée
  reminderCount: number;      // nombre de relances déjà effectuées
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ['en cours', 'entretien', 'refusé', 'accepté'],
      default: 'en cours',
    },
    appliedDate: { type: Date, default: Date.now },
    link: String,
    notes: String,
    attachments: [{ fileName: String, url: String }],
    lastReminder: { type: Date },                // nouveau champ
    reminderCount: { type: Number, default: 0 }, // nouveau champ
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);