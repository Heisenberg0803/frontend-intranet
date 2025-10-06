import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Edit, Trash2, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { newApi } from '../../service/newsApi';
import { News } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newApi.getAll();
        setNews(response);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = (newsItem: News) => {
    setNewsToDelete(newsItem);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;

    setDeleteLoading(true);
    try {
      await newApi.delete(newsToDelete.id);
      setNews(news.filter(item => item.id !== newsToDelete.id));
      setNewsToDelete(null);
    } catch (error) {
      console.error('Failed to delete news:', error);
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
        <h1 className="text-2xl font-bold text-gray-800">Notícias</h1>
        {isAdmin && (
          <Link to="/admin/news/new">
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Notícia
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notícia</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isAdmin ? 'Comece criando uma nova notícia.' : 'Não há notícias disponíveis no momento.'}
            </p>
          </div>
        ) : (
          news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt!).toLocaleDateString('pt-BR')}
                  </span>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/news/edit/${item.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item)}
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
      {newsToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir a notícia "{newsToDelete.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setNewsToDelete(null)}
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

export default NewsList;