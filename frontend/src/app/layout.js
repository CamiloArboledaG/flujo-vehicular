import { Inter } from 'next/font/google';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/layout/Header';
import { SensorDataProvider } from '../context/SensorDataContext';
import { VehicleProvider } from '../context/VehicleContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Simon - Monitoreo Vehicular',
  description: 'Plataforma de monitoreo de flotas en tiempo real',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <SensorDataProvider>
            <VehicleProvider>
              <Toaster />
              <div className="flex h-screen">
                <main className="flex-1 flex flex-col h-screen">
                  <div className="flex-1 overflow-y-auto">{children}</div>
                </main>
              </div>
            </VehicleProvider>
          </SensorDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
