
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ username, password });
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center h-full bg-card">
      <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-center text-foreground">Crear una Cuenta</h1>
        <p className="text-center text-muted-foreground">
          Únete a nosotros. El registro es rápido y fácil.
        </p>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2.5 mt-2 bg-card border border-border rounded-lg text-foreground text-base focus:ring-brand focus:border-brand"
              placeholder="tu-usuario"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 mt-2 bg-card border border-border rounded-lg text-foreground text-base focus:ring-brand focus:border-brand"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 font-semibold text-card bg-brand rounded-lg hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand cursor-pointer"
          >
            Registrarse
          </button>
        </form>
        <div className="text-center text-muted-foreground">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 