'use client';

import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { useEffect, useState } from 'react';
import { useSensorData } from '../../context/SensorDataContext';
import { useVehicles } from '../../context/VehicleContext';
import { Car, Truck } from 'lucide-react';

export default function MapComponent() {
  const [viewport, setViewport] = useState({
    longitude: -74.08175,
    latitude: 4.60971,
    zoom: 10,
  });

  const { filteredVehicles, updateSearchTerm, trackingInfo, consumeTrackedVehicle } = useVehicles();
  const sensorData = useSensorData();

  useEffect(() => {
    const { vehicle } = trackingInfo;
    if (!vehicle) return;

    const latestData = sensorData[vehicle.id];
    if (latestData?.latitude && latestData?.longitude) {
      setViewport((prev) => ({
        ...prev,
        latitude: latestData.latitude,
        longitude: latestData.longitude,
        zoom: 15, // Zoom más cercano
      }));
      // Limpiamos el estado para que el rastreo sea un evento de una sola vez
      consumeTrackedVehicle();
    }
  }, [trackingInfo, sensorData, consumeTrackedVehicle]);

  const handleMarkerClick = (vehicle) => {
    updateSearchTerm(vehicle.license_plate);
  };

  // IMPORTANTE: Reemplaza esto con tu propia clave de API de un proveedor de mapas.
  const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  const mapStyle = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
      >
        <NavigationControl position="top-right" />

        {filteredVehicles.map((vehicle) => {
          const latestData = sensorData[vehicle.id];
          if (latestData?.latitude && latestData?.longitude) {
            return (
              <Marker key={vehicle.id} latitude={latestData.latitude} longitude={latestData.longitude} anchor="center">
                <button
                  onClick={() => handleMarkerClick(vehicle)}
                  className="bg-brand text-white p-2 rounded-full shadow-md hover:bg-brand/90 transition-colors bg-black"
                  aria-label={`Seleccionar vehículo ${vehicle.license_plate}`}
                >
                  <Car size={20} color="white" />
                </button>
              </Marker>
            );
          }
          return null;
        })}
      </Map>
    </div>
  );
}
