import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface Application {
  _id: string;
  company: string;
  position: string;
  status: 'en cours' | 'entretien' | 'refusé' | 'accepté';
  appliedDate: string;
  link?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/applications`);
      setApplications(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (data: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/applications`, data);
      toast.success('Candidature ajoutée');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  const updateApplication = async (id: string, data: Partial<Application>) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/applications/${id}`, data);
      toast.success('Candidature mise à jour');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/applications/${id}`);
      toast.success('Candidature supprimée');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
};