import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { announcementApi } from '../../service/announcementApi';
import { Announcement } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementApi.getAll();
        setAnnouncements(response);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;

    setDeleteLoading(true);
    try {
      await announcementApi.delete(announcementToDelete.id);
      setAnnouncements(announcements.filter(item => item.id !== announcementToDelete.id));
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Anúncios</h1>
        {isAdmin && (
          <Link to="/admin/announcements/new">
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Anúncio
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum anúncio</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isAdmin ? 'Comece criando um novo anúncio.' : 'Não há anúncios no momento.'}
              </p>
            </div>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImportanceColor(announcement.importance)}`}>
                        {announcement.importance === 'high' ? 'Alta' : announcement.importance === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{announcement.content}</p>
                    <p className="mt-4 text-sm text-gray-500">
                      Publicado em {new Date(announcement.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/admin/announcements/edit/${announcement.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(announcement)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {announcementToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir o anúncio "{announcementToDelete.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setAnnouncementToDelete(null)}
                disabled={deleteLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={deleteLoading}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;