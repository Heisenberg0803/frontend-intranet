import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { announcementApi } from '../../service/announcementApi';
import { Announcement } from '../../types/type';

const AnnouncementForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    importance: 'medium',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!isEditMode) return;

      try {
        const response = await announcementApi.getById(parseInt(id as string));
        setFormData(response);
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
        setError('Falha ao carregar dados do anúncio');
      }
    };

    fetchAnnouncement();
  }, [id, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await announcementApi.update(parseInt(id as string), formData);
      } else {
        await announcementApi.create(formData as Omit<Announcement, 'id'>);
      }
      navigate('/announcements');
    } catch (err) {
      console.error('Failed to save announcement:', err);
      setError('Falha ao salvar anúncio. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/announcements" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Anúncio' : 'Novo Anúncio'}
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
            label="Conteúdo"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importância
            </label>
            <select
              name="importance"
              value={formData.importance}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/announcements')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditMode ? 'Atualizar' : 'Criar'} Anúncio
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AnnouncementForm;