
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Cargando...</div>; // O un spinner/skeleton screen
    }

    if (!user) {
      return null; // O un fallback, aunque el redirect debería ocurrir antes
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth; 