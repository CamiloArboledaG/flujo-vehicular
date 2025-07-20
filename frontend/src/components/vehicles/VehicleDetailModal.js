'use client';

import { useEffect, useState } from 'react';
import config from '../../config/config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';
import { fetchWithAuth } from '@/utils/api';

// Función para calcular la distancia entre dos puntos (fórmula de Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  // Convertir grados a radianes
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  // Calcular la distancia
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  // Calcular la distancia angular
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Calcular la distancia en km
  return R * c; // Distancia en km
}

export default function VehicleDetailModal({ vehicle, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vehicle) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`${config.URL_API}/sensor-data/${vehicle.id}`);

        if (!response.ok) {
          throw new Error('Error al obtener el historial del vehículo');
        }

        const data = await response.json();

        // Procesar datos para añadir velocidad y formatear
        const processedData = data
          // Ordenar los datos por timestamp
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((current, index, arr) => {
            let speed = 0; // Velocidad en km/h
            // Si no es el primer dato, calcular la velocidad
            if (index > 0) {
              const previous = arr[index - 1];
              // Calcular la distancia entre el punto actual y el anterior
              const distance = getDistance(previous.latitude, previous.longitude, current.latitude, current.longitude);
              // Calcular el tiempo transcurrido en horas
              const timeDiffHours = (new Date(current.timestamp) - new Date(previous.timestamp)) / (1000 * 60 * 60);
              if (timeDiffHours > 0) {
                speed = distance / timeDiffHours; // km/h
              }
            }
            return {
              ...current,
              speed: parseFloat(speed.toFixed(2)),
              time: new Date(current.timestamp).toLocaleTimeString(),
            };
          });

        setHistory(processedData);
      } catch (error) {
        if (error.message !== 'No autorizado') {
          console.error('Error fetching vehicle history:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-black border border-border rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Detalles del Vehículo: <span className="text-brand">{vehicle.license_plate}</span>
        </h2>

        {loading ? (
          <div className="flex-1 flex justify-center items-center text-foreground">Cargando datos...</div>
        ) : (
          <div className="flex-1 flex flex-col gap-8 overflow-hidden pt-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2 text-center text-foreground">Nivel de Combustible (%)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fill: '#9ca3af' }} />
                  <YAxis stroke="#888" domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937', // Un gris oscuro
                      borderColor: '#374151',
                      color: '#e5e7eb',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="fuel_level" name="Combustible" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2 text-center text-foreground">Velocidad (km/h)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fill: '#9ca3af' }} />
                  <YAxis stroke="#888" tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="speed" name="Velocidad" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
