import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface ApplicationFormProps {
  initialData?: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('en cours');
  const [appliedDate, setAppliedDate] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setPosition(initialData.position || '');
      setStatus(initialData.status || 'en cours');
      if (initialData.appliedDate) {
        const date = new Date(initialData.appliedDate);
        const formatted = date.toISOString().split('T')[0];
        setAppliedDate(formatted);
      }
      setLink(initialData.link || '');
      setNotes(initialData.notes || '');
      setExistingAttachments(initialData.attachments || []);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setAppliedDate(today);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedFileUrl = null;
      let uploadedFileName = null;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedFileUrl = uploadRes.data.url;
        uploadedFileName = uploadRes.data.fileName;
      }

      const applicationData = {
        company,
        position,
        status,
        appliedDate,
        link,
        notes,
        attachments: uploadedFileUrl
          ? [...existingAttachments, { fileName: uploadedFileName, url: uploadedFileUrl }]
          : existingAttachments,
      };

      onSubmit(applicationData);
    } catch (error) {
      toast.error("Erreur lors de l'upload du fichier");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setExistingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {initialData ? 'Modifier la candidature' : 'Ajouter une candidature'}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Entreprise *</label>
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Poste *</label>
          <input
            type="text"
            required
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="en cours">En cours</option>
            <option value="entretien">Entretien</option>
            <option value="refusé">Refusé</option>
            <option value="accepté">Accepté</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de candidature</label>
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lien de l'offre</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pièce jointe (CV, lettre...)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900 dark:file:text-indigo-300"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Fichier sélectionné : {file.name}
            </p>
          )}
          {existingAttachments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pièces jointes existantes :</p>
              <ul className="list-disc list-inside">
                {existingAttachments.map((att, idx) => (
                  <li key={idx} className="text-sm flex items-center justify-between">
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {att.fileName}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {uploading ? 'Upload...' : initialData ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;