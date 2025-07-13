'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import config from '../config/config';

const VehicleContext = createContext();

export function useVehicles() {
  return useContext(VehicleContext);
}

export function VehicleProvider({ children }) {
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Cargar todos los vehículos una sola vez
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${config.URL_API}/vehicles`);
        const data = await response.json();
        setAllVehicles(data);
        setFilteredVehicles(data); // Inicialmente, todos los vehículos están visibles
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

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

  const value = {
    filteredVehicles,
    searchTerm,
    updateSearchTerm,
  };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}
