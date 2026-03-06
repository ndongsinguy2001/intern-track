import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { uploadFile, handleUpload } from '../controllers/uploadController';

const router = express.Router();

router.post('/', authMiddleware, uploadFile, handleUpload);

export default router;