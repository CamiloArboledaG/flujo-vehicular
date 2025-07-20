
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center h-full bg-card">
      <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-center text-foreground">Iniciar Sesión</h1>
        <p className="text-center text-muted-foreground">
          Bienvenido de nuevo. Accede a tu cuenta.
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
            Iniciar Sesión
          </button>
        </form>
         <div className="text-center text-muted-foreground">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-semibold text-brand hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 