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
