import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">Falavinha Next</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">Intranet Corporativa</h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;