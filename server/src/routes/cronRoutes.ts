import express from 'express';
import { sendReminders } from '../controllers/cronController';

const router = express.Router();

// Route accessible uniquement avec un secret (Bearer token)
router.get('/reminders', sendReminders);

export default router;