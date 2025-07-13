import { Inter } from 'next/font/google';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { SensorDataProvider } from '../context/SensorDataContext';
import { VehicleProvider } from '../context/VehicleContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Simon - Monitoreo Vehicular',
  description: 'Plataforma de monitoreo de flotas en tiempo real',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SensorDataProvider>
          <VehicleProvider>
            <div className="flex h-screen">
              <main className="flex-1 flex flex-col h-screen">
                <Header />
                <div className="flex-1 overflow-y-auto">{children}</div>
              </main>
            </div>
          </VehicleProvider>
        </SensorDataProvider>
      </body>
    </html>
  );
}
