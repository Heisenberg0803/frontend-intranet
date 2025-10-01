import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Newspaper, 
  Calendar, 
  Bell, 
  Link as LinkIcon,
  Settings,
  Plus,
  FileEdit,
  LogOut,
  ShieldCheck,
  Building2,
  LogIn,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Notícias', path: '/news', icon: <Newspaper size={20} /> },
    { name: 'Eventos', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Anúncios', path: '/announcements', icon: <Bell size={20} /> },
    { name: 'Links Favoritos', path: '/links', icon: <LinkIcon size={20} /> },
    { name: 'Agenda', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Sobre a Empresa', path: '/about', icon: <Building2 size={20} /> },
  ];

  // Only show Employees section if authenticated
  if (isAuthenticated) {
    navigationItems.splice(1, 0, { name: 'Colaboradores', path: '/employees', icon: <Users size={20} /> });
  }

  const adminItems = [
    { name: 'Gerenciar Usuários', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Nova Notícia', path: '/admin/news/new', icon: <Plus size={20} /> },
    { name: 'Novo Evento', path: '/admin/events/new', icon: <Plus size={20} /> },
    { name: 'Novo Anúncio', path: '/admin/announcements/new', icon: <Plus size={20} /> },
    { name: 'Novo Link', path: '/admin/links/new', icon: <Plus size={20} /> },
    { name: 'Novo Evento na Agenda', path: '/admin/calendar/new', icon: <Plus size={20} /> },
    { name: 'Editar Informações da Empresa', path: '/admin/about/edit', icon: <FileEdit size={20} /> },
    { name: 'Logs do Sistema', path: '/admin/logs', icon: <FileText size={20} /> },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ease-linear ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-full max-w-xs z-30 bg-blue-700 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-12 pt-4">
          <button
            className="p-2 rounded-md text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-white text-xl font-bold">Falavinha Next</span>
          </div>

          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-600'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-700">
              <span className="text-white text-xl font-bold">Falavinha Next</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-blue-700">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-100 hover:bg-blue-600'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 truncate">
                {navigationItems.find((item) => item.path === location.pathname)?.name || 'Intranet'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                    title="Menu Administrativo"
                  >
                    <Settings className="h-6 w-6" />
                  </button>

                  {adminMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                      <div className="py-1">
                        {adminItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setAdminMenuOpen(false)}
                          >
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut size={20} className="mr-3" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="ml-3 relative">
                {isAuthenticated ? (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 relative">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.image|| "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        alt="User profile"
                      />
                      {isAdmin && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1" title="Administrador">
                          <ShieldCheck size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <div className="text-sm font-medium text-gray-700">
                        {user?.name} {user?.lastName}
                      </div>
                    </div>
                    {!isAdmin && (
                      <button
                        onClick={handleLogout}
                        className="ml-3 text-gray-400 hover:text-gray-600"
                        title="Sair"
                      >
                        <LogOut size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <LogIn size={18} className="mr-2" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;