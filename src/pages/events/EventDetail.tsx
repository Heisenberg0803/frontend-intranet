import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Edit } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Event } from '../../types/type';
import { eventApi } from '../../service/eventApi';
import { useAuth } from '../../contexts/AuthContext';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const response = await eventApi.getById(Number(id));
        setEvent(response);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Evento não encontrado</h2>
        <Link to="/events" className="mt-4 text-blue-600 hover:underline">
          Voltar para lista de eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/events" className="text-blue-600 hover:underline">
          ← Voltar para eventos
        </Link>
        {isAdmin && (
          <Link to={`/admin/events/edit/${event.id}`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar Evento
            </Button>
          </Link>
        )}
      </div>

      <Card>
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              <span>{new Date(event.start_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              <span>{new Date(event.start_date).toLocaleTimeString('pt-BR')}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>

          {event.author && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Criado por {event.author.name} {event.author.last_name} em{' '}
                {new Date(event.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EventDetail;