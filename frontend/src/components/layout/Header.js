'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout, loading } = useAuth();


  if(loading || !user) {
    return null;
  }

  return (
    <header className="h-[var(--header-height)] px-6 flex justify-between items-center border-b border-border bg-card">
      <h1 className="text-xl font-semibold">Plataforma de Monitoreo Vehicular</h1>
      <div className="flex items-center gap-4">
        {!loading && user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 p-2 rounded-lg border-none cursor-pointer font-semibold bg-secondary text-foreground hover:bg-secondary/80"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        )}
      </div>
    </header>
  );
}
