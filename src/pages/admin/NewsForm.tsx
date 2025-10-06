import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { newApi } from '../../service/newsApi';
import { News } from '../../types/type';

const NewsForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<News>>({
    title: '',
    content: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      if (!isEditMode) return;

      try {
        const response = await newApi.getById(Number(id));
        const newsData = response;
        setFormData({
          title: newsData.title,
          content: newsData.content,
        });
        if (newsData.image) {
          setPreviewImage(newsData.image);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setError('Falha ao carregar notícia');
      }
    };

    fetchNews();
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    if (image) {
      formDataToSend.append('image', image);
    }

   try {
  if (isEditMode) {
    await newApi.update(Number(id), formData);
  } else {
    await newApi.create(formData as Omit<News, 'id'>); 
  }
  navigate('/news');
} catch (err) {
  console.error('Failed to save news:', err);
  setError('Falha ao salvar notícia. Por favor, tente novamente.');
}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/news" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Notícia' : 'Nova Notícia'}
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
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewImage || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'}
                  alt="News preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <label
                  htmlFor="news-image"
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Upload size={16} />
                </label>
                <input
                  id="news-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

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
            rows={8}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/news')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditMode ? 'Atualizar' : 'Publicar'} Notícia
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewsForm;