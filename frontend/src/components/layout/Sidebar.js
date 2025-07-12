'use client';

import { usePathname } from 'next/navigation';
import { File, Globe, Settings, BarChart } from 'lucide-react';

const navItems = [
  { name: 'Mapa', href: '/', icon: Globe },
  // { name: 'Vehículos', href: '/vehicles', icon: File },
  // { name: 'Reportes', href: '/reports', icon: BarChart },
  // { name: 'Administrativo', href: '/admin', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] bg-secondary p-6 flex flex-col h-screen border-r border-border">
      <div className="text-4xl font-bold mb-10 pl-3">Simon</div>
      <nav className="flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const linkClasses = `flex items-center p-3 rounded-lg mb-2 text-base transition-colors ${
            isActive
              ? 'bg-brand text-card font-semibold'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`;
          return (
            <a key={item.name} href={item.href} className={linkClasses}>
              <item.icon className="mr-4 w-5 h-5" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>
      {/* <div className="flex items-center mb-5 p-3">
        <div className="w-10 h-10 rounded-full bg-brand mr-3"></div>
        <div>
          <p className="font-semibold text-sm">Camilo Alejandro Marin</p>
          <p className="text-xs text-muted-foreground">System Administrator</p>
        </div>
      </div>
      <div className="p-3 text-center text-muted-foreground cursor-pointer">Cerrar sesión</div> */}
    </aside>
  );
}
