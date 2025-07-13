'use client';

import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { useEffect, useState } from 'react';
import { useSensorData } from '../../context/SensorDataContext';
import config from '../../config/config';
import { Car, Truck } from 'lucide-react';

export default function MapComponent() {
  const [viewport, setViewport] = useState({
    longitude: -74.08175,
    latitude: 4.60971,
    zoom: 10,
  });

  const [vehicles, setVehicles] = useState([]);
  const sensorData = useSensorData();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${config.URL_API}/vehicles`);
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const handleMarkerClick = (vehicle) => {
    console.log('Vehículo seleccionado:', vehicle);
    // Aquí podrías implementar la lógica para mostrar un popup,
    // centrar el mapa en el vehículo, o seleccionar el vehículo en la lista.
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

        {vehicles.map((vehicle) => {
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
