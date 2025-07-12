'use client';

import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { useState } from 'react';

export default function MapComponent() {
  const [viewport, setViewport] = useState({
    longitude: -74.08175,
    latitude: 4.60971,
    zoom: 10,
  });

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
        {/* Aquí irán los marcadores de los vehículos */}
        <Marker latitude={4.60971} longitude={-74.08175} anchor="center"></Marker>
        <Marker latitude={4.60971} longitude={-75.08175} anchor="center" offset={[0, -20]}></Marker>
      </Map>
    </div>
  );
}
