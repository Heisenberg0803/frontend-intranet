import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trophy, Award, GraduationCap, Star, ThumbsUp, Lightbulb } from 'lucide-react';
import Card from '../../components/ui/Card';
import { userApi } from '../../service/userApi';
import { User } from '../../types/type';
import { useAuth } from '../../contexts/AuthContext';

interface UserRanking {
  user_id: number;
  name: string;
  last_name: string;
  profile_image?: string;
  innovation_count: number;
  innovation_score: number;
  compliment_count: number;
  certification_count: number;
  certification_score: number;
  training_count: number;
  training_hours: number;
  total_score: number;
}

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userApi.getAll();
        setEmployees(users);
        setFilteredEmployees(users);

        // extrair departamentos únicos
        const uniqueDepartments = Array.from(
          new Set(users.map(u => u.department).filter(Boolean))
        ).sort();
        setDepartments(uniqueDepartments);

      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(
      user =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         user.last_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedDepartment || user.department === selectedDepartment)
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, selectedDepartment, employees]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Diretório de Colaboradores</h1>
        {isAdmin && (
          <Link
            to="/admin/users/new"
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Novo Colaborador
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar colaboradores por nome..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os Departamentos</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Lista de usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(user => (
            <Link key={user.id} to={`/employees/${user.id}`}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="p-6 flex items-center space-x-4">
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={`http://localhost:3001${user.profile_image}`|| "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                    alt={`${user.name} ${user.last_name}`}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user.name} {user.last_name}</h3>
                    {user.department && (
                      <p className="text-gray-600 mt-1">{user.department}</p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Nenhum colaborador encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
