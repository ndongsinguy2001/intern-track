import express from 'express';
import { getUsers } from '../controllers/adminController';

const router = express.Router();

// Route pour récupérer la liste des utilisateurs (protégée par le secret)
router.get('/users', getUsers);

export default router;