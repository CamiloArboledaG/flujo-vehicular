'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import config from '../config/config';
import { useAuth } from './AuthContext';
import { fetchWithAuth } from '@/utils/api';

const VehicleContext = createContext();

export function useVehicles() {
  return useContext(VehicleContext);
}

const VEHICLES_CACHE_KEY = 'vehicles_cache';

export function VehicleProvider({ children }) {
  const { user } = useAuth();
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingInfo, setTrackingInfo] = useState({ vehicle: null, trigger: 0 });

  // 1. Cargar todos los vehículos, reaccionando al estado del usuario
  useEffect(() => {
    // Solo hacemos el fetch si hay un usuario autenticado
    if (!user) {
      // Si no hay usuario, limpiamos los datos para evitar mostrar datos de una sesión anterior
      setAllVehicles([]);
      setFilteredVehicles([]);
      return;
    }

    // Intentar cargar desde el caché primero
    try {
      const cachedVehicles = localStorage.getItem(VEHICLES_CACHE_KEY);
      if (cachedVehicles) {
        const parsedVehicles = JSON.parse(cachedVehicles);
        setAllVehicles(parsedVehicles);
        setFilteredVehicles(parsedVehicles);
      }
    } catch (error) {
      console.error('Error al leer el caché de vehículos:', error);
    }

    // Luego, buscar datos frescos
    const fetchVehicles = async () => {
      try {
        const response = await fetchWithAuth(`${config.URL_API}/vehicles`);

        if (!response.ok) {
          // El error 401 ya fue manejado, pero otros errores pueden ocurrir
          throw new Error('Error al obtener los vehículos');
        }

        const data = await response.json();
        setAllVehicles(data);
        setFilteredVehicles(data);
        // Guardar en caché para la próxima vez
        localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        // No mostramos el toast de error si es por "No autorizado", ya que fetchWithAuth ya lo hizo.
        if (error.message !== 'No autorizado') {
          console.error('Error fetching vehicles:', error);
        }
      }
    };
    fetchVehicles();
  }, [user]); // <-- La dependencia clave es el usuario

  // 2. Función para actualizar el filtro
  const updateSearchTerm = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredVehicles(allVehicles);
    } else {
      const filtered = allVehicles.filter((v) => v.license_plate.toLowerCase().includes(term.toLowerCase()));
      setFilteredVehicles(filtered);
    }
  };

  // 3. Función para establecer el vehículo a rastrear
  const trackVehicle = (vehicle) => {
    setTrackingInfo((prev) => ({ vehicle, trigger: prev.trigger + 1 }));
  };

  // 4. Función para consumir/limpiar el evento de rastreo
  const consumeTrackedVehicle = () => {
    setTrackingInfo((prev) => ({ ...prev, vehicle: null }));
  };

  const value = {
    filteredVehicles,
    searchTerm,
    updateSearchTerm,
    trackingInfo,
    trackVehicle,
    consumeTrackedVehicle,
  };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}
