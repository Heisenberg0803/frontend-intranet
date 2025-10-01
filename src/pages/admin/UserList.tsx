import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Check, X, Key } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ResetPasswordModal from '../../components/admin/ResetPasswordModal';
import { userApi } from '../../service/userApi';
import { User } from '../../types/type';

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAll();
        setUsers(response);
        setFilteredUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleDelete = async (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setActionLoading(true);
    try {
      await userApi.delete(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(false);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
        
        <Link
          to="/admin/users/new"
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Novo Usuário
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Mostrar inativos</span>
          </label>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ramal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile_image || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                            alt={`${user.name} ${user.last_name}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'ADMIN'  ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Não
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setUserToResetPassword(user)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Redefinir Senha"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir o usuário <span className="font-medium">{userToDelete.name} {userToDelete.last_name}</span>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setUserToDelete(null)}
                disabled={actionLoading}
              >
                <X size={16} className="mr-1" />
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
                isLoading={actionLoading}
              >
                <Check size={16} className="mr-1" />
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {userToResetPassword && (
        <ResetPasswordModal
          user={userToResetPassword}
          onClose={() => setUserToResetPassword(null)}
          onSuccess={() => {
            // You can add a success notification here if needed
          }}
        />
      )}
    </div>
  );
};

export default UserList;