'use client';

import MapComponent from '@/components/map/MapComponent';
import VehicleList from '@/components/vehicles/VehicleList';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <VehicleList />
      <div className="flex-1 h-full">
        <MapComponent />
      </div>
    </div>
  );
}
