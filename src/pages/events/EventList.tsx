import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { eventApi } from '../../service/eventApi';
import { Event } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAll();
        setEvents(response);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = (event: Event) => {
    setEventToDelete(event);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    setDeleteLoading(true);
    try {
      await eventApi.delete(eventToDelete.id);
      setEvents(events.filter(event => event.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
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
        <h1 className="text-2xl font-bold text-gray-800">Eventos</h1>
        {isAdmin && (
          <Link to="/admin/events/new">
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Evento
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum evento</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isAdmin ? 'Comece criando um novo evento.' : 'Não há eventos programados no momento.'}
            </p>
          </div>
        ) : (
          events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(event.start_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <Link
                        to={`/admin/events/edit/${event.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(event);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir o evento "{eventToDelete.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setEventToDelete(null)}
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

export default EventList;