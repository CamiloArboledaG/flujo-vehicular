'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import config from '../config/config';

const SensorDataContext = createContext();

export function useSensorData() {
  return useContext(SensorDataContext);
}

export function SensorDataProvider({ children }) {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    // 1. Obtener los datos iniciales
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${config.URL_API}/vehicles/status`);
        const initialVehicles = await response.json();

        // Transformar el array de vehículos en un objeto de sensorData
        const initialSensorData = initialVehicles.reduce((acc, vehicle) => {
          if (vehicle.latitude && vehicle.longitude) {
            acc[vehicle.id] = {
              vehicle_id: vehicle.id,
              latitude: vehicle.latitude,
              longitude: vehicle.longitude,
              fuel_level: vehicle.fuel_level,
              temperature: vehicle.temperature,
              timestamp: vehicle.timestamp,
            };
          }
          return acc;
        }, {});
        setSensorData(initialSensorData);
      } catch (error) {
        console.error('Error fetching initial sensor data:', error);
      }
    };

    fetchInitialData();

    // 2. Conectarse al WebSocket para actualizaciones en tiempo real
    const wsUrl = config.URL_API.replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Conectado al servidor WebSocket para datos de sensores.');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'NEW_SENSOR_DATA') {
        const newPayload = message.payload;

        setSensorData((prevData) => ({
          ...prevData,
          [newPayload.vehicle_id]: newPayload,
        }));
      }
    };

    ws.onclose = () => {
      console.log('Desconectado del servidor WebSocket.');
    };

    ws.onerror = (error) => {
      console.error('Error de WebSocket:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return <SensorDataContext.Provider value={sensorData}>{children}</SensorDataContext.Provider>;
}
