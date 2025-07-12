import { Inter } from 'next/font/google';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Simôn - Monitoreo Vehicular',
  description: 'Plataforma de monitoreo de flotas en tiempo real',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen">
            <Header />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
