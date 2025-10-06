import { Link, useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Building2 } from 'lucide-react';
import { userApi } from '../../service/userApi';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { User } from '../../types/type';
import { useEffect, useState } from 'react';

const formatDate = (dateStr?: string) =>
  dateStr ? format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR }) : '-';

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const response = await userApi.getById(Number(id));
        const phonesAsStrings = response.phones?.map((p: any) => p.number) || [];

        setUser({
          ...response,
          phones: phonesAsStrings
        });
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);




  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!user)
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Colaborador não encontrado</h2>
        <Link to="/employees" className="mt-4 inline-block text-blue-600 hover:underline">
          Voltar para o Diretório
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">
          <img
            className="h-48 w-48 rounded-full object-cover shadow-md"
            src={
              `http://localhost:3001${user.profile_image}`||
              'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
            }
            alt={`${user.name} ${user.last_name}`}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{`${user.name} ${user.last_name}`}</h1>
{/* Seção de Contatos */}
<div className="mt-4 bg-white p-6 rounded-lg shadow space-y-3">
  <h2 className="text-xl font-semibold text-gray-800 mb-2">Informações de Contato</h2>
  
  {/* Departamento */}
  <div className="flex items-center space-x-2 text-gray-600">
    <Building2 className="h-5 w-5 text-blue-500" />
    <span>{user.department || 'Departamento não especificado'}</span>
  </div>

  {/* Email */}
  <div className="flex items-center space-x-2 text-gray-600">
    <Mail className="h-5 w-5 text-blue-500" />
    <span>{user.email}</span>
  </div>

  {/* Telefones */}
  {user.phones && user.phones.length > 0 && (
    <div className="flex flex-col space-y-1">
      {user.phones.map((phone, index) => (
        <div key={index} className="flex items-center space-x-2 text-gray-600">
          <Phone className="h-5 w-5 text-blue-500" />
          <span>{phone}</span>
        </div>
      ))}
    </div>
  )}

  {/* Pontos */}
  <div className="text-lg font-semibold text-blue-600 mt-2">Pontos: {user.points}</div>
</div>

        </div>
      </div>

      {/* História na Empresa */}
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">História na Companhia</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {user.company_history || 'Nenhuma história registrada.'}
        </p>
      </div>
    </div>
  );
};

export default EmployeeDetail;
