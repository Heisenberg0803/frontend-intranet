import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { eventsApi } from '../../service/api';
import { CalendarEvent } from '../../types/type';

const CalendarForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    allDay: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEditMode) return;

      try {
        const response = await eventsApi.getById(id as string);
        const eventData = response.data;
        
        setFormData({
          ...eventData,
          startDate: eventData.start_date.split('T')[0],
          endDate: eventData.end_date?.split('T')[0] || '',
        });
      } catch (error) {
        console.error('Failed to fetch calendar event:', error);
        setError('Falha ao carregar dados do evento');
      }
    };

    fetchEvent();
  }, [id, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const eventFormData = new FormData();
    eventFormData.append('title', formData.title || '');
    eventFormData.append('description', formData.description || '');
    eventFormData.append('location', formData.location || '');
    eventFormData.append('start_date', formData.startDate || '');
    eventFormData.append('end_date', formData.endDate || '');

    try {
      if (isEditMode) {
        await eventsApi.update(id as string, eventFormData);
      } else {
        await eventsApi.create(eventFormData);
      }
      navigate('/calendar');
    } catch (err) {
      console.error('Failed to save calendar event:', err);
      setError('Falha ao salvar evento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/calendar" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Evento' : 'Novo Evento'}
          </h1>
        </div>
      </div>

      <Card>
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <TextArea
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
          />

          <Input
            label="Local"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="allDay"
              name="allDay"
              checked={formData.allDay}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">
              Evento de dia inteiro
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data e Hora de Início"
              name="startDate"
              type={formData.allDay ? 'date' : 'datetime-local'}
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Data e Hora de Término"
              name="endDate"
              type={formData.allDay ? 'date' : 'datetime-local'}
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/calendar')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditMode ? 'Atualizar' : 'Criar'} Evento
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CalendarForm;