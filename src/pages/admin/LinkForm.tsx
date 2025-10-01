import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { linksApi } from '../../service/api';
import { FavoriteLink } from '../../types/type';

const LinkForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<FavoriteLink>>({
    title: '',
    url: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLink = async () => {
      if (!isEditMode) return;

      try {
        const response = await linksApi.getById(parseInt(id as string));
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch link:', error);
        setError('Falha ao carregar dados do link');
      }
    };

    fetchLink();
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        await linksApi.update(parseInt(id as string), formData);
      } else {
        await linksApi.create(formData);
      }
      navigate('/links');
    } catch (err) {
      console.error('Failed to save link:', err);
      setError('Falha ao salvar link. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/links" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Link' : 'Novo Link'}
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

          <Input
            label="URL"
            name="url"
            type="url"
            value={formData.url}
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/links')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditMode ? 'Atualizar' : 'Criar'} Link
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LinkForm;