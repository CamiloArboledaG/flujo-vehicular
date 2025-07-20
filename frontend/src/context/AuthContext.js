
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config from '@/config/config';
import { toast } from 'react-hot-toast';
import { fetchWithAuth } from '@/utils/api'; // Usaremos esto para la validación del login

const AuthContext = createContext(null);

function parseJwt(token) {
  if (!token) {
    return null;
  }
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = parseJwt(token);

      // Verificamos si el token ha expirado
      if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
        setUser(decodedUser);
      } else {
        // Si el token es inválido o expiró, lo removemos
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetchWithAuth(`${config.URL_API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    const decodedUser = parseJwt(data.token);
    setUser(decodedUser);
    router.push('/');
  };

  const register = async (userData) => {
    // Para el registro, no necesitamos fetchWithAuth porque no estamos autenticados aún
    const response = await fetch(`${config.URL_API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en el registro');
    }

    toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
    router.push('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 