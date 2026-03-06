export interface Application {
  _id: string;
  company: string;
  position: string;
  status: 'en cours' | 'entretien' | 'refusé' | 'accepté';
  appliedDate: string;
  link?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}