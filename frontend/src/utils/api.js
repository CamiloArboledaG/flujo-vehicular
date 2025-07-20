'use client';

import { toast } from 'react-hot-toast';

/**
 * Un wrapper sobre la función fetch que gestiona la autenticación
 * y el manejo de errores 401 (No autorizado) de forma centralizada.
 *
 * @param {string} url - La URL del endpoint de la API a la que llamar.
 * @param {object} options - Las opciones de configuración para fetch (método, body, etc.).
 * @returns {Promise<Response>} - La respuesta de la llamada fetch.
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  // Añadir el encabezado de autorización si existe un token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // Si la respuesta es 401 (No autorizado), significa que el token
  // es inválido o ha expirado. Deslogueamos al usuario.
  if (response.status === 401) {
    // Solo desloguear si había un token. Si no, es una petición no autenticada normal.
    if (token) {
      console.error('Token inválido o expirado. Cerrando sesión.');
      toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      localStorage.removeItem('token');
      // Forzamos un refresco a la página de login para reiniciar el estado de la app.
      window.location.href = '/login';
    }

    // Lanzamos un error para que la cadena de promesas se detenga aquí.
    throw new Error('No autorizado');
  }

  return response;
}; 