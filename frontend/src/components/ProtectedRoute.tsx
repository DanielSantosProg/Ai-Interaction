import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2Icon } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({ redirectPath = '/', children }: ProtectedRouteProps) => {
  const { user, loading } = useContext(AuthContext);

  // Exibe um spinner de carregamento enquanto o estado de autenticação está sendo verificado
  if (loading) {
    return (
      <div className='flex h-screen justify-center items-center'>
        <Loader2Icon className="animate-spin mr-2" size={20} />
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;