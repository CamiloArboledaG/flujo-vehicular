'use client';

import MapComponent from '@/components/map/MapComponent';
import VehicleList from '@/components/vehicles/VehicleList';
import withAuth from '@/components/auth/withAuth';
import Header from '@/components/layout/Header';

function HomePage() {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-var(--header-height))]">
        <VehicleList />
        <div className="flex-1 h-full">
          <MapComponent />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomePage);
