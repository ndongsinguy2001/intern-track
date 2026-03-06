import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Application {
  _id: string;
  company: string;
  position: string;
  status: 'en cours' | 'entretien' | 'refusé' | 'accepté';
  appliedDate: string;
  link?: string;
  notes?: string;
  attachments?: { fileName: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export const getApplications = async (): Promise<Application[]> => {
  const response = await axios.get(`${API_URL}/applications`);
  return response.data;
};

export const createApplication = async (data: Partial<Application>): Promise<Application> => {
  const response = await axios.post(`${API_URL}/applications`, data);
  return response.data;
};

export const updateApplication = async (id: string, data: Partial<Application>): Promise<Application> => {
  const response = await axios.put(`${API_URL}/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/applications/${id}`);
};