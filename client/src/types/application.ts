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