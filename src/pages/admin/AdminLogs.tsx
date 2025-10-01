import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  User,
  Filter,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface LogEntry {
  id: string;
  user_id: string;
  action_type: 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout';
  entity_type: string;
  entity_id: string;
  details: any;
  ip_address: string;
  user_agent: string;
  status: string;
  created_at: string;
  user?: {
    name: string;
    last_name: string;
    department: string;
  };
}

interface FilterState {
  startDate: string;
  endDate: string;
  userId: string;
  actionType: string;
  department: string;
  search: string;
}

const ITEMS_PER_PAGE = 20;

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    userId: '',
    actionType: '',
    department: '',
    search: '',
  });

  useEffect(() => {
    fetchLogs();
    fetchUsers();
    fetchStats();
  }, [currentPage, sortField, sortOrder, filters]);

  const fetchLogs = async () => {
    try {
      let query = supabase
        .from('admin_logs')
        .select('*, user:users(name, last_name, department)', { count: 'exact' });

      // Apply filters
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      if (filters.department) {
        query = query.eq('user.department', filters.department);
      }
      if (filters.search) {
        query = query.or(`entity_id.ilike.%${filters.search}%,details->>'message'.ilike.%${filters.search}%`);
      }

      // Apply sorting and pagination
      const { data, error, count } = await query
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      setLogs(data || []);
      setTotalLogs(count || 0);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, last_name, department')
        .order('name');

      if (error) throw error;

      setUsers(data || []);
      setDepartments(Array.from(new Set(data?.map(user => user.department).filter(Boolean))));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_log_stats')
        .select('*')
        .limit(30);

      if (error) throw error;

      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportLogs = async (format: 'csv' | 'pdf') => {
    try {
      // Create log entry for export action
      await supabase.rpc('create_admin_log', {
        p_user_id: null, // Current user ID should be passed here
        p_action_type: 'export',
        p_entity_type: 'logs',
        p_entity_id: null,
        p_details: { format },
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });

      // Handle export based on format
      if (format === 'csv') {
        const csvContent = logs.map(log => {
          return [
            new Date(log.created_at).toLocaleString(),
            `${log.user?.name} ${log.user?.last_name}`,
            log.action_type,
            log.entity_type,
            log.entity_id,
            log.status,
            log.ip_address
          ].join(',');
        }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin_logs_${new Date().toISOString()}.csv`;
        a.click();
      } else {
        // For PDF export, we'll use the edge function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-logs-pdf`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logs })
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin_logs_${new Date().toISOString()}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
      case 'login':
        return <LogIn className="w-4 h-4" />;
      case 'logout':
        return <LogOut className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      case 'view':
        return 'text-gray-600';
      case 'export':
        return 'text-purple-600';
      case 'login':
        return 'text-teal-600';
      case 'logout':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Logs do Sistema</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => exportLogs('csv')}
          >
            <Download size={16} className="mr-2" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportLogs('pdf')}
          >
            <Download size={16} className="mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Atividade Recente</h3>
            <div className="space-y-2">
              {stats && Object.entries(stats[0]?.stats || {}).map(([action, data]: [string, any]) => (
                <div key={action} className="flex justify-between items-center">
                  <span className={`flex items-center ${getActionColor(action)}`}>
                    {getActionIcon(action)}
                    <span className="ml-2 capitalize">{action}</span>
                  </span>
                  <span className="text-gray-600">
                    {data.total} ({data.errors > 0 && <span className="text-red-500">{data.errors} erros</span>})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="Data Inicial"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              type="date"
              label="Data Final"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.actionType}
              onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
            >
              <option value="">Todos os Tipos</option>
              <option value="create">Criar</option>
              <option value="update">Atualizar</option>
              <option value="delete">Excluir</option>
              <option value="view">Visualizar</option>
              <option value="export">Exportar</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            >
              <option value="">Todos os Usuários</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.last_name}
                </option>
              ))}
            </select>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">Todos os Departamentos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <Input
              type="text"
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="col-span-full"
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Data/Hora
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('user_id')}
                >
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    Usuário
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {log.user ? `${log.user.name} ${log.user.last_name}` : 'Sistema'}
                      </div>
                      {log.user?.department && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({log.user.department})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center ${getActionColor(log.action_type)}`}>
                      {getActionIcon(log.action_type)}
                      <span className="ml-2 capitalize">{log.action_type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{log.entity_type}</span>
                      <span className="text-xs">{log.entity_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              onClick={() => setCurrentPage(page => page + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= totalLogs}
            >
              Próxima
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> até{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalLogs)}
                </span>{' '}
                de <span className="font-medium">{totalLogs}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(page => page + 1)}
                  disabled={currentPage * ITEMS_PER_PAGE >= totalLogs}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Detalhes do Log</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data/Hora</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedLog.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuário</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedLog.user ? `${selectedLog.user.name} ${selectedLog.user.last_name}` : 'Sistema'}
                  {selectedLog.user?.department && ` (${selectedLog.user.department})`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ação</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className={getActionColor(selectedLog.action_type)}>
                    {getActionIcon(selectedLog.action_type)}
                  </span>
                  <span className="ml-2 capitalize">{selectedLog.action_type}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Entidade</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedLog.entity_type} ({selectedLog.entity_id})
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Detalhes</label>
                <pre className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.ip_address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User Agent</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.user_agent}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedLog.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedLog.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedLog(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;