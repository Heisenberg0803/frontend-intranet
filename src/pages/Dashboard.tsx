import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Newspaper, Bell, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import type { Announcement, News, Event } from '../types/type';
import axios from "axios";

const Dashboard = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [announcementsRes, newsRes, eventsRes] = await Promise.all([
          axios.get("/announcement"),
          axios.get("/news"),
          axios.get("/events"),
        ]);

        // Processar comunicados
        const rawAnnouncements = announcementsRes.data;
        if (Array.isArray(rawAnnouncements)) {
          setAnnouncements(rawAnnouncements);
        } else if (rawAnnouncements && Array.isArray(rawAnnouncements.data)) {
          setAnnouncements(rawAnnouncements.data);
        } else if (rawAnnouncements) {
          setAnnouncements([rawAnnouncements]);
        } else {
          setAnnouncements([]);
        }

        // Processar notícias
        const rawNews = newsRes.data;
        if (Array.isArray(rawNews)) {
          setLatestNews(rawNews);
        } else if (rawNews && Array.isArray(rawNews.data)) {
          setLatestNews(rawNews.data);
        } else if (rawNews) {
          setLatestNews([rawNews]);
        } else {
          setLatestNews([]);
        }

        // Processar eventos
        const rawEvents = eventsRes.data;
        if (Array.isArray(rawEvents)) {
          setUpcomingEvents(rawEvents);
        } else if (rawEvents && Array.isArray(rawEvents.data)) {
          setUpcomingEvents(rawEvents.data);
        } else if (rawEvents) {
          setUpcomingEvents([rawEvents]);
        } else {
          setUpcomingEvents([]);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bem-vindo à Intranet Falavinha Next</h1>
      
      {/* Announcements Banner */}
      {Array.isArray(announcements) && announcements.length > 0 && (
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <Bell className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Comunicados Importantes</h3>
              <ul className="mt-2 space-y-2">
                {announcements.map((announcement, index) => (
                  <li key={announcement.id ?? index} className="text-sm">
                    <span className="font-medium">{announcement.title}</span>: {announcement.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Latest News */}
        <Card title="Últimas Notícias" className="col-span-1">
          <div className="space-y-4">
            {Array.isArray(latestNews) && latestNews.length > 0 ? (
              latestNews.map((news) => (
                <Link 
                  key={news.id ?? news.title} 
                  to={`/news/${news.id}`}
                  className="block hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors"
                >
                  <div className="flex items-start">
                    <Newspaper className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">{news.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{news.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(news.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma notícia disponível</p>
            )}
          </div>
          <div className="text-center mt-4">
            <Link 
              to="/news" 
              className="text-blue-600 text-sm hover:underline inline-flex items-center"
            >
              Ver todas as notícias
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card title="Próximos Eventos" className="col-span-1">
          <div className="space-y-4">
            {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Link 
                  key={event.id ?? event.title} 
                  to={`/events/${event.id}`}
                  className="block hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors"
                >
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(event.start_date).toLocaleDateString('pt-BR')} - {event.location}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum evento programado</p>
            )}
          </div>
          <div className="text-center mt-4">
            <Link 
              to="/events" 
              className="text-blue-600 text-sm hover:underline inline-flex items-center"
            >
              Ver todos os eventos
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Quick Links */}
        <Card title="Acesso Rápido" className="col-span-1">
          <div className="space-y-4">
            <Link 
              to="/employees" 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-500 mr-3" />
              <span className="font-medium">Diretório de Colaboradores</span>
            </Link>
            <Link 
              to="/calendar" 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Calendar className="h-5 w-5 text-blue-500 mr-3" />
              <span className="font-medium">Agenda Corporativa</span>
            </Link>
            <Link 
              to="/links" 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-blue-500 mr-3" />
              <span className="font-medium">Links Favoritos</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
