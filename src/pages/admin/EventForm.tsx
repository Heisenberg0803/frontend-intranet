import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { eventApi } from '../../service/eventApi';
import { Event } from '../../types/type';

const EventForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    location: string;
    start_date: string; // 👈 string para trabalhar com input type="date"
    end_date: string;
  }>({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // carregar evento para edição
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEditMode) return;

      try {
        const eventData = await eventApi.getById(parseInt(id));

        setFormData({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          start_date: eventData.start_date.split('T')[0],
          end_date: eventData.end_date.split('T')[0],
        });

        if (eventData.image) {
          setPreviewImage(eventData.image);
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setError('Falha ao carregar dados do evento');
      }
    };

    fetchEvent();
  }, [id, isEditMode]);

  // inputs de texto/data
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // input de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          // datas convertidas para ISO
          if (key === 'start_date' || key === 'end_date') {
            formDataToSend.append(key, new Date(value).toISOString());
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      if (image) {
        formDataToSend.append('image', image);
      }

if (isEditMode) {
  await eventApi.update(parseInt(id), {
    ...formData,
    title: '',
    description: '',
    location: '',
    start_date: new Date(formData.start_date).toISOString(),
    end_date: new Date(formData.end_date).toISOString(),
  });
} else {
  await eventApi.create(formData as Omit<Event, "id">);
}


      navigate('/events');
    } catch (err) {
      console.error('Failed to save event:', err);
      setError('Falha ao salvar evento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/events" className="mr-4 text-gray-500 hover:text-gray-700">
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
          {/* imagem */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={
                    previewImage ||
                    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                  }
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <label
                  htmlFor="event-image"
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Upload size={16} />
                </label>
                <input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* título */}
          <Input
            label="Título do Evento"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          {/* descrição */}
          <TextArea
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
          />

          {/* local */}
          <Input
            label="Local"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />

          {/* datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data de Início"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Data de Término"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* botões */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/events')}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading}>
              <Save size={16} className="mr-2" />
              {isEditMode ? 'Atualizar' : 'Criar'} Evento
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EventForm;
