import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { newApi } from '../../service/newsApi';
import { News } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      
      try {
        const response = await newApi.getById(Number(id));
        setNews(response);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Notícia não encontrada</h2>
        <Link to="/news" className="mt-4 text-blue-600 hover:underline">
          Voltar para lista de notícias
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/news" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para notícias
        </Link>
        {isAdmin && (
          <Link to={`/admin/news/edit/${news.id}`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar Notícia
            </Button>
          </Link>
        )}
      </div>

      <Card>
        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(news.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{news.content}</p>
          </div>

          {news.author && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Publicado por {news.author.name} {news.author.last_name}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewsDetail;