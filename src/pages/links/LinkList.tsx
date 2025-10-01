import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { linksApi } from '../../service/api';
import { FavoriteLink } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

const LinkList = () => {
  const [links, setLinks] = useState<FavoriteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkToDelete, setLinkToDelete] = useState<FavoriteLink | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await linksApi.getAll();
        setLinks(response.data);
      } catch (error) {
        console.error('Failed to fetch links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleDelete = (link: FavoriteLink) => {
    setLinkToDelete(link);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;

    setDeleteLoading(true);
    try {
      await linksApi.delete(linkToDelete.id.toString());
      setLinks(links.filter(link => link.id !== linkToDelete.id));
      setLinkToDelete(null);
    } catch (error) {
      console.error('Failed to delete link:', error);
    } finally {
      setDeleteLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Links Favoritos</h1>
        {isAdmin && (
          <Link to="/admin/links/new">
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Link
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {links.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum link favorito</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isAdmin ? 'Comece adicionando um novo link.' : 'Não há links favoritos disponíveis.'}
            </p>
          </div>
        ) : (
          links.map((link) => (
            <Card key={link.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                    <p className="text-gray-600 mb-4">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Acessar
                      <ExternalLink size={16} className="ml-1" />
                    </a>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/admin/links/edit/${link.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(link)}
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
      {linkToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir o link "{linkToDelete.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setLinkToDelete(null)}
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

export default LinkList;