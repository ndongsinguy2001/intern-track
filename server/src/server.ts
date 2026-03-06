import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import des routes
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import cronRoutes from './routes/cronRoutes'; 
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes publiques
app.get('/', (req, res) => {
  res.send('API InternTrack est en ligne !');
});

// Monter les routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cron', cronRoutes); // NOUVEAU
app.use('/api/admin', adminRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB :', error);
  });