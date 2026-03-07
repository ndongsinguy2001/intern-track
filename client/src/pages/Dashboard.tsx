import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import ApplicationList from '../components/ApplicationList';
import ApplicationForm from '../components/ApplicationForm';
import DashboardCharts from '../components/DashboardCharts';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface Application {
  _id: string;
  company: string;
  position: string;
  status: string;
  appliedDate: string;
  link?: string;
  notes?: string;
  attachments?: { fileName: string; url: string }[];
  reminderCount?: number;
  lastReminder?: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdd = () => {
    setEditingApp(null);
    setShowForm(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
      try {
        await api.delete(`/applications/${id}`);
        toast.success('Candidature supprimée');
        fetchApplications();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingApp) {
        await api.put(`/applications/${editingApp._id}`, data);
        toast.success('Candidature mise à jour');
      } else {
        await api.post('/applications', data);
        toast.success('Candidature ajoutée');
      }
      setShowForm(false);
      fetchApplications();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">InternTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">Bonjour, {user?.name}</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Changer le thème"
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes candidatures</h2>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Ajouter une candidature
            </button>
          </div>

          {!loading && applications.length > 0 && <DashboardCharts applications={applications} />}

          {showForm && (
            <div className="mb-6">
              <ApplicationForm
                initialData={editingApp}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <ApplicationList
              applications={applications}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;