import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { userApi } from '../../service/userApi';
import { User } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

const UserForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState<Partial<User> & { 
    password?: string;
    confirmPassword?: string;
  }>({
      name: '',
      last_name: '',
      email: '',
      password_hash: '',
      department: '',
      phone: '',
      profile_image: " ",
      company_history: '',
      role: 'VISITOR',
      points: 0,
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!isEditMode) return;
      
      try {
        const userData = await userApi.getById(Number(id));
        
        if (userData) {
          setFormData({
            name: userData.name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            company_history: userData.company_history,
            role: userData.role,
            department: userData.department || '',
            points: userData.points,
          });
          
          if (userData.profile_image) {
            setPreviewImage(userData.profile_image);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Falha ao carregar dados do usuário');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setError('Apenas administradores podem gerenciar usuários');
      return;
    }

    setLoading(true);
    setError('');

    if (!isEditMode && !formData.password) {
      setError('A senha é obrigatória para novos usuários');
      setLoading(false);
      return;
    }

    if ((formData.password || formData.confirmPassword) && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'confirmPassword') {
        formDataToSend.append(key, value.toString());
      }
    });
    
    if (profileImage) {
      formDataToSend.append('profile_image', profileImage);
    }

    try {
      if (isEditMode) {
  await userApi.update(Number(id), formData); // usa o estado direto
} else {
  await userApi.create(formData as Omit<User, 'id'>);
}
      
      navigate('/employees');
    } catch (err) {
      console.error('Failed to save user:', err);
      setError(err instanceof Error ? err.message : 'Falha ao salvar usuário. Verifique todos os campos e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Acesso Negado</h2>
        <p className="mt-2 text-gray-600">Você não tem permissão para acessar esta página.</p>
        <Link to="/employees" className="mt-4 inline-block text-blue-600 hover:underline">
          Voltar para o Diretório
        </Link>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/employees" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}
          </h1>
        </div>
      </div>

      <Card>
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={previewImage || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <Upload size={16} />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Sobrenome"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Email Corporativo"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Departamento"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              placeholder="Ex: TI, RH, Financeiro"
            />

            <Input
              label="Ramal"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />

             <Input
              label="Nivel de acesso"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />

             <Input
              label="Pontos"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
            />

            {!isEditMode && (
              <>
                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />

                <Input
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </>
            )}
          </div>

          <TextArea
            label="História na Empresa"
            name="company_history"
            value={formData.company_history}
            onChange={handleInputChange}
            rows={4}
          />

          <div className="flex items-center">
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="VISITOR">Visitor</option>
              <option value="ADMIN">Admin</option>
            </select>

            <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
              Usuário Administrador
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/employees')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditMode ? 'Atualizar' : 'Criar'} Colaborador
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;