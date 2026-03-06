import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { upload } from '../config/cloudinary';

export const uploadFile = upload.single('file');

export const handleUpload = (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }
    const fileUrl = (req.file as any).path;
    const fileName = req.file.originalname;
    res.json({ url: fileUrl, fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'upload" });
  }
};